import React from "react";
const DisabledContext = React.createContext(false);
export default DisabledContext.Provider;
export const DisabledConsumer = DisabledContext.Consumer;
