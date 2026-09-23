import { describe, expect, it } from 'vitest'
import { menuApi } from './api'

describe('Sunrise admin credentials', () => {
  it('accepts only the fixed admin credentials', async () => {
    await expect(menuApi.login('skyrise@hotel.com', 'sky123')).resolves.toMatchObject({ user: { role: 'ADMIN' } })
    await expect(menuApi.login('wrong@example.com', 'sky123')).rejects.toThrow('Invalid credentials. Please try again.')
    await expect(menuApi.login('skyrise@hotel.com', 'wrong-password')).rejects.toThrow('Invalid credentials. Please try again.')
  })
})
