import React from "react";
import Input from "./Input";
const Renamable = ({ isRenaming, onSubmit, value, ...props }) => {
  let input;
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit(input.value);
      }}
    >
      {isRenaming ? (
        <Input
          {...props}
          innerRef={element => {
            if (element !== null) element.select();
            input = element;
          }}
          defaultValue={value}
        />
      ) : (
        value
      )}
    </form>
  );
};
export default Renamable;
