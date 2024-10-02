import EventEmitter from 'events';
import logEvents from './logEvent.js'; 

const myEmitter = new EventEmitter();

myEmitter.on('log', function(event){
    logEvents(event);
});

setTimeout(() => {
    myEmitter.emit('log', 'New log event emitted');
}, 2000);