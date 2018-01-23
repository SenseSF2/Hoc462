import React from 'react'
export default ({ isRenaming, onSubmit, value, ...props }) => {
  let input
  return (
    <form onSubmit={event => { event.preventDefault(); onSubmit(input.value) }}>
      {isRenaming
        ? <input {...props}
          keydown={event => event.stopPropagation()}
          ref={element => {
            if (element !== null) element.select()
            input = element
          }}
          defaultValue={value}
        />
        : value}
    </form>
  )
}
