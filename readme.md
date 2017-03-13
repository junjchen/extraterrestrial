## Extraterrestrial

Is an event finder made by **JunJie Chen** for **Viagogo** with :alien:

- if there are more than 5 events when search by manhattan distance, pick the 5 with lowest ticket prices.
- The data structure backed is basically a 2-d array which every item is an object to represent an event
- To enable having more than 1 event in the same location, it will be necessary to implement a 3-d array with an extra dimension of events
- To work with a big world size, there will be 2 bottlenecks , namely space and time complexity
    - Space complexity can be reduced by avoid intermediate variables being created
    - Time complexity can be reduced by using an more efficient datastructure (probably it will be better using graph to orchestrate events, that can do a quicker search-by-distance)
- Some work can still be done:
    - static code check
    - test coverage
    - integration test
    - continues integration
    - autoprefix css
    - minify css and js

## Run

1. clone this repo
2. `yarn install --production` (or `npm install --production`)
3. run `node ./lib/cli.js`

## Demo

A [demo](https://junjchen.github.io/extraterrestrial) web page is created for visualization