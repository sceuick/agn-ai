import needle from 'needle'
import { logger } from '../../logger'
import { sanitise, trimResponse } from '../chat/common'
import { HORDE_GUEST_KEY } from '../horde'
import { publishOne } from '../ws/handle'
import { getGenSettings } from './presets'
import { ModelAdapter } from './type'

const baseUrl = 'https://stablehorde.net/api/v2'

const base = { n: 1, max_context_length: 1024 }
const defaultModel = 'PygmalionAI/pygmalion-6b'

export const handleHorde: ModelAdapter = async function* ({ char, members, prompt, user, sender }) {
  if (!user.horde || !user.horde.model) {
    yield { error: `Horde request failed: Not configured` }
    return
  }

  const settings = getGenSettings('basic', 'kobold')
  const body = {
    models: [user.horde?.model || defaultModel],
    prompt,
    workers: [],
  }

  const params = { ...base, ...settings }
  const headers = { apikey: user.horde?.key || HORDE_GUEST_KEY, 'Client-Agent': 'KoboldAiLite:11' }

  const init = await needle(
    'post',
    `${baseUrl}/generate/text/async`,
    { ...body, params },
    {
      json: true,
      headers,
    }
  ).catch((err) => ({ error: err }))

  if ('error' in init) {
    yield { error: `Horde request failed: ${init.error.message || init.error}` }
    return
  }

  if (init.statusCode && init.statusCode >= 400) {
    yield { error: `Horde request failed: ${init.statusMessage}` }
    logger.error({ error: init.body }, `Horde request failed`)
    return
  }

  if (init.body.message) {
    yield { error: `Horde request failed: ${init.body.message}` }
    return
  }

  const id = init.body.id
  const started = Date.now()
  await wait()

  logger.info({ id }, 'Horde async request started')

  let text = ''
  let checks = 0

  while (true) {
    const diff = Date.now() - started
    if (diff > 120000) {
      yield { error: `Horde request failed: Timed out` }
      return
    }

    const check = await needle('get', `${baseUrl}/generate/text/status/${id}`, {
      json: true,
    }).catch((error) => ({ error }))

    if ('error' in check) {
      yield { error: `Horde request failed: ${check.error}` }
      return
    }

    if (check.statusCode && check.statusCode >= 400) {
      logger.error({ error: check.body }, `Horde request failed`)
      yield { error: `Horde request failed: ${check.statusMessage}` }
      return
    }

    if (!check.body.done) {
      checks++
      if (checks === 1) {
        publishOne(sender.userId, { type: 'message-horde-eta', eta: check.body.wait_time })
      }
      await wait()
      continue
    }

    if (check.body.faulted) {
      logger.error({ error: check.body }, `Horde request failed: Job failure`)
      yield { error: `Horde request failed: Job failure` }
      continue
    }

    if (check.body.generations.length) {
      text = check.body.generations[0].text
      logger.debug({ generations: check.body.generations, text }, `Horde response`)
      break
    }
  }

  const sanitised = sanitise(text)
  const trimmed = trimResponse(sanitised, char, members, ['END_OF_DIALOG'])
  yield trimmed ? trimmed.response : sanitised
}

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 2000))
}
