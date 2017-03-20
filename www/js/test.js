// Create the event
var event = new CustomEvent("deviceready", { "detail": "Example of an event" });

// Dispatch/Trigger/Fire the event
document.dispatchEvent(event);
