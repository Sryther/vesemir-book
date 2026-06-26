import { useState, useEffect, useCallback } from 'react'

const KEY = 'vesemir-grimoire-v1'

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY)) || {}
    return {
      solved: data.solved || {},
      bannersDone: !!data.bannersDone,
      monstersDone: !!data.monstersDone,
    }
  } catch {
    return { solved: {}, bannersDone: false, monstersDone: false }
  }
}

export function useProgress() {
  const [state, setState] = useState(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const markSolved = useCallback((id) => {
    setState((s) => ({ ...s, solved: { ...s.solved, [id]: true } }))
  }, [])

  const markBannersDone = useCallback(() => {
    setState((s) => ({ ...s, bannersDone: true }))
  }, [])

  const markMonstersDone = useCallback(() => {
    setState((s) => ({ ...s, monstersDone: true }))
  }, [])

  const reset = useCallback(
    () => setState({ solved: {}, bannersDone: false, monstersDone: false }),
    [],
  )

  return {
    solved: state.solved,
    bannersDone: state.bannersDone,
    monstersDone: state.monstersDone,
    markSolved,
    markBannersDone,
    markMonstersDone,
    reset,
  }
}
