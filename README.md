# Mining-Bot


Please Visit [Mining-Bot Documentation](https://daemon-technologies.github.io/docs/)

- [WSL Tutorial Video](https://www.youtube.com/watch?v=FXifFx0Akzc)
- [MacOS](https://www.youtube.com/watch?v=TCtCTttsSeI)


## Pooling

Example: 
Pool begins mining in cycle #10. Any BTC sent to the specified address before cycle #10 begins is counted as a contribution.

### Before Cycle #10

For example:
- You contribute 0.1 BTC
- Other people contribute 0.9 BTC total 
- Pool has a total of 1 BTC right before cycle #10 begins, so you will earn 0.1/1 = 10% of all mining rewards in cycle #10.

### Cycle #10 

- You earn 10% of all mining rewards this cycle.
- This address begins to mine STX.
- BTC sent to this address during this cycle will count as contributions for cycle #11
- By the end of cycle #10, 0.1 BTC has been spent on mining, and another 0.9 BTC was contributed, so pool now has 1.8 BTC before cycle #11. 
- The BTC received before cycle #10 is now 0.9 and receives a weight of 0.9/1.8 = 50%, and you receive 10% of this, so you get a total of 5% of all mining rewards in cycle #11. 

### Cycle #11
- You receive 10% of all mining rewards this cycle. 
- This address continues mining STX.
- BTC sent to this address during this cycle will count as contributions for cycle #12
- By the end of cycle #11, another 0.1 BTC has been spent on mining, and no other BTC was contributed, so pool now has 1.7 BTC before cycle #12.
- Since no other BTC was received, you still get a total of 5% of all mining rewards in cycle #12.

### Cycle #12
- You receive 10% of all mining rewards this cycle.
- This address continues mining STX.
- BTC sent to this address during this cycle will count as contributions for cycle #13
- You contribute another 0.4 BTC to the pool
- By the end of cycle #12, another 0.1 BTC has been spent on mining, so there is now 2 BTC before cycle #13. 
- The BTC received before cycle #10 is now 1.6 and receives a weight of 1.6 / 2.0 = 80%, and you receive 5% of this, and you just contributed 0.4 / 2.0 = 20%, so you will receive 20% + 5% * 80% = 24% of all mining rewards in cycle #13.

### Manage Pool

On this page, you can manage a stacks mining pool. You should be able to: 
- Define the btc address you want to pool on. Other people will send their btc to this address. 
- See who has contributed to your pool. 
- See how much time left in the "cycle". 

### Join Pool

On this page, you can see the mining pool you joined. You should be able to: 
- enter a bitcoin address to join their pool
- you can also specify how many bitcoin you want to send every "cycle"
- see how much remaining time for this "cycle"