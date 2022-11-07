//設定chart的屬性

const HchartProperties = {
  width:500,
  height:300,
  timeScale:{
    //time可見
    timeVisible:true,
    //seconds不可見
    secondsVisible:false,
  }
}

const HdomElement = document.getElementById('Huo_chart');
const Hchart = LightweightCharts.createChart(HdomElement,HchartProperties);
const HcandleSeries = Hchart.addCandlestickSeries();

//--------------------------------------------------------------------------------------------------------------
//歷史數據

fetch(`https://api.huobi.pro/market/history/kline/?period=1day&size=200&symbol=btcusdt`)
  .then(response => response.json())
  .then(result =>{  
    //data內的資料
    const Hcdata = result.data.map(d=>{

      return {time:d.id,open:d.open,high:d.high,low:d.low,close:d.close}
    });
    console.log(result);
    HcandleSeries.setData(Hcdata.reverse());
  })
  .catch(err => console.log(err))


//--------------------------------------------------------------------------------------------------------------
//實時報價

var ws_huobi_url = "wss://api-aws.huobi.pro/ws";
window.onload = function(){
  var ws_huobi = new WebSocket(ws_huobi_url);
  ws_huobi.onopen = function(){
    console.log("連接成功");
    ws_huobi.send(JSON.stringify({"sub": "market.btcusdt.kline.1min","id":"BTC"}));
  }

  ws_huobi.onclose = function(e) {
    console.log("連線關閉");
  }

  ws_huobi.onmessage = function(evt) {
    if(evt.data instanceof Blob){
      var result = '';
      var reader = new FileReader();
      reader.onload = function() {
        result = JSON.parse(pako.inflate(reader.result,{to:'string'}));
        const Hcandlestick=result.tick;
        //console.log(result);

        if(result.ping){
          ws_huobi.send(JSON.stringify({pong:result.ping}));
        }

        if(result.id == 'BTC' ||result.id == 'ETH'||result.id == 'DOGE'){
          console.log('ws sub success')
          //console.log(result);
        }

        if(typeof(result.ch)=='string'){
          const Hts=result.ts;
          const Htime = timestamp(Hts);
          //console.log(time);
          HcandleSeries.update({
            time: Htime,
            open: Hcandlestick.open,
            close: Hcandlestick.close,
            low: Hcandlestick.low,
            high: Hcandlestick.high
          })
        }
      }
    }
    reader.readAsBinaryString(evt.data);
  }
}

function timestamp(Hts){
  const Htimestamp = Hts;
  const Hdate=new Date(Htimestamp);
  Y = Hdate.getFullYear() + '-';
  M = (Hdate.getMonth()+1 < 10 ? '0'+(Hdate.getMonth()+1) : Hdate.getMonth()+1) + '-';
  D = Hdate.getDate() + ' ';
  h = Hdate.getHours() + ':';
  m = Hdate.getMinutes() + ':';
  s = Hdate.getSeconds();
  if(h=='0:'&m=='0:'&s==0){
    const Htime = Y+M+D;
    return Htime;
  }
  else{
    const Htime = Y+M+D+h+m+s;
    return Htime;
  }
}
