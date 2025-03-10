import { max } from '../src/logic/utils'
import {test,expect} from 'vitest'

test('max first is ok',()=>{
    expect(max(4,3)).toBe(4)
})


test('max second is ok',()=>{
    expect(max(4,13)).toBe(13)
})