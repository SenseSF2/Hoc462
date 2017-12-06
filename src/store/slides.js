import EventBus from '../EventBus'
export default ({ getState, setState }) => {
  EventBus.addEventListener('slide-added', ({ detail }) => {
    setState({
      ...getState(),
      slides: [...getState().slides, {
        name: detail.name,
        id: detail.id,
        view: detail.view,
        caption: detail.caption,
        animations: detail.animations,
        selectedAnimation: null
      }]
    })
  })
  EventBus.addEventListener('slide-selected', ({ detail: { id } }) => {
    setState({ ...getState(), selectedSlide: id })
  })
  EventBus.addEventListener('slide-renamed', ({ detail: { name, id } }) => {
    setState({
      ...getState(),
      slides: getState().slides.map(
        slide => slide.id === id ? { ...slide, name } : slide
      )
    })
  })
  EventBus.addEventListener(
    'slide-view-changed', ({ detail: { id, view } }) => {
      setState({
        ...getState(),
        slides: getState().slides.map(
          slide => slide.id === id ? { ...slide, view } : slide
        )
      })
    }
  )
  EventBus.addEventListener('slide-removed', ({ detail }) => {
    setState({
      ...getState(),
      slides: getState().slides.filter(({ id }) => id !== detail.id)
    })
  })
  let animation
  EventBus.addEventListener('started-adding-animation', () => {
    const { position, rotation, scale } = getState().objects
      .find(({ id }) => id === getState().selectedObject)
    animation = {
      target: getState().selectedObject,
      destination: { position, rotation, scale },
      duration: null
    }
  })
  EventBus.addEventListener(
    'animation-destination-changed',
    ({ detail: { position, rotation, scale, id, slideId } }) => {
      if (id !== undefined && slideId !== undefined) {
        setState({
          ...getState(),
          slides: getState().slides.map(
            slide => slide.id === slideId ? {
              ...slide,
              animations: slide.animations.map(
                animation => animation.id === id
                  ? {
                    ...animation,
                    destination: {
                      ...animation.destination, position, rotation, scale
                    }
                  }
                  : animation
              )
            } : slide
          )
        })
      } else {
        animation = { ...animation, destination: { position, rotation, scale } }
      }
    }
  )
  EventBus.addEventListener(
    'animation-duration-changed', ({ detail: { id, duration } }) => {
      setState({
        ...getState(),
        slides: getState().slides.map(
          slide => slide.id === getState().selectedSlide ? {
            ...slide,
            animations: slide.animations.map(
              animation => animation.id === id
                ? { ...animation, duration }
                : animation
            )
          } : slide
        )
      })
    }
  )
  EventBus.addEventListener(
    'finished-adding-animation', ({ detail: { id, slideId, duration } }) => {
      animation = { ...animation, duration, id }
      const selectedSlide =
        () => getState().slides.find(({ id }) => id === getState().selectedSlide)
      const isAnAnimationSelected =
        selectedSlide() !== undefined &&
        selectedSlide().animations.some(
          ({ id }) => id === selectedSlide().selectedAnimation
        )
      if (isAnAnimationSelected) {
        // insert the animation after the currently selected one.
        setState({
          ...getState(),
          slides: getState().slides.map(slide => slide.id === slideId ? {
            ...slide,
            animations: [].concat(...slide.animations.map(
              currentAnimation =>
                currentAnimation.id === slide.selectedAnimation
                  ? [currentAnimation, animation]
                  : currentAnimation
              )
            )
          } : slide)
        })
      } else {
        setState({
          ...getState(),
          slides: getState().slides.map(slide => slide.id === slideId ? {
            ...slide,
            animations: [...slide.animations, animation]
          } : slide)
        })
      }
    }
  )
  EventBus.addEventListener(
    'animation-selected', ({ detail: { id, slideId } }) => {
      setState({
        ...getState(),
        slides: getState().slides.map(slide => slide.id === slideId ? {
          ...slide, selectedAnimation: id
        } : slide)
      })
    }
  )
  const animationMovedTo = direction => {
    EventBus.addEventListener(
      `animation-moved-${direction}`, ({ detail: { id } }) => {
        setState({
          ...getState(),
          slides: getState().slides.map(slide => slide.animations.some(
            ({ id: currentId }) => currentId === id
          ) ? {
            ...slide,
            animations: (() => {
              const thisAnimationIndex = slide.animations.indexOf(
                slide.animations.find(({ id: currentId }) => currentId === id)
              )
              const thatAnimationIndex = thisAnimationIndex + ({
                left: -1, right: 1
              })[direction]
              if (slide.animations[thatAnimationIndex] === undefined) {
                return slide.animations
              }
              const thisAnimation = slide.animations[thisAnimationIndex]
              const thatAnimation = slide.animations[thatAnimationIndex]
              return slide.animations.map(animation => {
                if (animation === thisAnimation) return thatAnimation
                if (animation === thatAnimation) return thisAnimation
                return animation
              })
            })()
          } : slide)
        })
      }
    )
  }
  animationMovedTo('left')
  animationMovedTo('right')
  EventBus.addEventListener(
    'animation-removed', ({ detail: { id, slideId } }) => {
      setState({
        ...getState(),
        slides: getState().slides.map(slide => slide.id === slideId ? {
          ...slide,
          animations: slide.animations.filter(
            ({ id: currentId }) => currentId !== id
          )
        } : slide)
      })
    })
}
