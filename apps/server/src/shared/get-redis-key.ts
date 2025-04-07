import { RedisKeysNum } from '@/constants/redis-keys.constant'

export const getRegisterCaptchaKey = (key: string) => {
    return `${RedisKeysNum.REGISTER_CAPTCHA_PREFIX}${key}`
}
