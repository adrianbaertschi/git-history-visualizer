import { mount } from '@vue/test-utils'
import Stats from './Stats.vue'

describe('Stats', () => {
  it('should render stats of one file', async () => {
    const wrapper = mount(Stats, {
      propsData: {
        fileChanges: [
          {
            path: '/src/main/Main.java',
            operation: 'ADD',
            isDirectory: false
          }
        ]
      }
    })
    expect(wrapper.text()).toContain('java: 1')
  })
})
