# Discord paginator

This is a module for Discord pagination embeds

## Doc

To use the paginator, simply use it like so :

```js
const { Paginator } = require('dsc-pagination');

const paginator = new Paginator({
    interaction: /* The command interaction goes here */,
    embeds: /* The embed pages goes here */,
    user: /* the only user allowed to interact goes here */
})
```

And you can add more options in the initialisation of the paginator

## Propreties

You have access to only two propreties of the paginator : `index` (wich is the current index of the embeds) and `stop()`, wich is a function that stop the paginator.
