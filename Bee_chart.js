const log = console.log;

const chartProperties = {
  width:500,
  height:300,
  timeScale:{
    timeVisible:true,
    secondsVisible:false,
  }
}

const domElement = document.getElementById('Bee_chart');
const chart = LightweightCharts.createChart(domElement,chartProperties);
const candleSeries = chart.addCandlestickSeries();


fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000`)
  .then(res => res.json())
  .then(data => {
    const cdata = data.map(d => {
      return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
    });
    candleSeries.setData(cdata);
  })
  .catch(err => log(err))

  //Dynamic Chart

var wsBinance1 = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");
wsBinance1.onmessage=function (event){
var message=JSON.parse(event.data);
var candlestick=message.k;

candleSeries.update({
    time: candlestick.t / 1000,
    open: candlestick.o,
    high:candlestick.h,
    low:candlestick.l,
    close:candlestick.c
})
}