window.onload = function() {
        //websocket Huobi
        let wsHuobi = new WebSocket("wss://api.huobi.pro/ws");
        //logon_msg = `{ "sub": "market.btcusdt.kline.1min", "id": "btcusdt" }`
        wsHuobi.onopen = function () {
            wsHuobi.send(JSON.stringify({"sub": "market.btcusdt.kline.1min","id":"btcusdt"}));
            wsHuobi.send(JSON.stringify({"sub": "market.btcusdt.kline.5min","id":"btcusdt"}));
            wsHuobi.send(JSON.stringify({"sub": "market.btcusdt.kline.30min","id":"btcusdt"})); 
        }
        wsHuobi.onmessage = function (event) {
            const fr = new FileReader();
            fr.onload = function () {
                // 用pako.inflate解壓縮 暫存在Uint8Array內的數據
                text = pako.inflate(new Uint8Array(fr.result), { to: 'string' })
                // text是解壓縮後的資料 下面是把text再予以Json化方便剖析
                let msg = JSON.parse(text);
                Hdata = msg;
                DisplayKinfo("","",Hdata);
    
                if (msg.ping) {
                    wsHuobi.send(JSON.stringify({
                        pong: msg.ping
                    }));
                }
            };
    
                fr.readAsArrayBuffer(event.data);
        }

    //websocket Binance
    let wsBinance = new WebSocket("wss://stream.binance.com/ws");
    wsBinance.onopen = function () {
        console.log("connection open");
        wsBinance.send(JSON.stringify({
        "method": "SUBSCRIBE",
        "params": [
            "btcusdt@kline_1m","btcusdt@kline_5m","btcusdt@kline_30m",
            //"ethusdt@kline_1m","ethusdt@kline_5m","ethusdt@kline_30m",
            // "dogeusdt@kline_1m","dogeusdt@kline_5m","dogeusdt@kline_30m"
        ],
        "id": 555668
        }
        ))
    };

    wsBinance.onmessage = event =>  {
        var Bdata = JSON.parse(event.data);
        //console.log(Bdata.k.c);
        DisplayKinfo(Bdata,"","")
                        
    };
    //websocket Coinbase
    let wsCoinbase = new WebSocket("wss://ws-feed.pro.coinbase.com");
    wsCoinbase.onopen = function () {
        wsCoinbase.send(JSON.stringify({
            "type": "subscribe",
            "product_ids": [
                //"DOGE-USD",
                "BTC-USD",
                //"ETH-USD"
            ],
            "channels": [
                "level1",
                //"heartbeat",
                {
                    "name": "ticker",
                    "product_ids": [
                            //"DOGE-USD",
                            "BTC-USD",
                            //"ETH-USD"
                    ]
                }
            ]
        })
        )
    }

            // ETH
            let ETH_open_1 = 0, ETH_higt_1 = 0, ETH_low_1 = 0, ETH_price_1 = 0, ETH_flag_1 = true, ETH_1_min = 0
            let ETH_open_5 = 0, ETH_higt_5 = 0, ETH_low_5 = 0, ETH_price_5 = 0, ETH_flag_5 = true
            let ETH_open_30 = 0, ETH_higt_30 = 0, ETH_low_30 = 0, ETH_price_30 = 0, ETH_flag_30 = true

            // BTC
            let BTC_open_1 = 0, BTC_higt_1 = 0, BTC_low_1 = 0, BTC_price_1 = 0, BTC_flag_1 = true, BTC_1_min = 0
            let BTC_open_5 = 0, BTC_higt_5 = 0, BTC_low_5 = 0, BTC_price_5 = 0, BTC_flag_5 = true
            let BTC_open_30 = 0, BTC_higt_30 = 0, BTC_low_30 = 0, BTC_price_30 = 0, BTC_flag_30 = true

            // DOGE
            let DOGE_open_1 = 0, DOGE_higt_1 = 0, DOGE_low_1 = 0, DOGE_price_1 = 0, DOGE_flag_1 = true, DOGE_1_min = 0
            let DOGE_open_5 = 0, DOGE_higt_5 = 0, DOGE_low_5 = 0, DOGE_price_5 = 0, DOGE_flag_5 = true
            let DOGE_open_30 = 0, DOGE_higt_30 = 0, DOGE_low_30 = 0, DOGE_price_30 = 0, DOGE_flag_30 = true

            wsCoinbase.onmessage = function (event) {
                //console.log(event.data);
                data = JSON.parse(event.data);
                //console.log(data.product_id + " " + data.time + " " + data.open_24h + " " + data.high_24h + " " + data.low_24h  + " " + data.price + " " + data.volume_24h)
                //取得當前分鐘
                var min = (data.time).substring(14,16)
                
                //price
                let ID = data.product_id, price = data.price, open = data.open, higt = data.high_24h, low = data.low_24h

                //ETH
                //如果ID=ETH那麼執行
                if(ID == "ETH-USD"){
                    //ETH_1
                    //如果是第一次那麼自動把取得的資料先丟進變數裡，之後就不會再來這了
                    if(ETH_open_1 == 0) {ETH_1_min = min, ETH_open_1 = price, ETH_higt_1 = price, ETH_low_1 = price, ETH_price_1 = price}
                    //查看時間是否等於剛剛的時間，如果不等於，flag也等於false，ETH_1_min會等於現在的時間
                    if(min != ETH_1_min && ETH_flag_1 == false){ ETH_flag_1 = true, ETH_1_min = min }
                    //如果現在的時間=ETH_1_min和ETH_flag_1=true那麼執行a否則b
                    if(min == ETH_1_min && ETH_flag_1 == true){ 
                        ETH_flag_1 = false
                        //把以前的資料覆蓋過去
                        ETH_open_1 = price, ETH_higt_1 = price, ETH_low_1 = price, ETH_price_1 = price
                    }else{
                        //取得當前價格
                        ETH_price_1 = price
                        //如果當前價格大於最高點，最高點會等於當前價格
                        if(ETH_higt_1 < price) ETH_higt_1 = price;
                        //如果當前價格小於最低點，最低點會等於當前價格
                        if(ETH_low_1 > price) ETH_low_1 = price;
                    }
                    //列印出ETH1分鐘的最高、開盤、現價(收盤)、最低
                    //console.log("ETH_1min:" + ETH_higt_1 + " " + ETH_open_1 + " " +  ETH_price_1 + " " + ETH_low_1)

                    // ETH_5
                    //如果是第一次那麼自動把取得的資料先丟進變數裡，之後就不會再來這了
                    if(ETH_open_5 == 0) {ETH_open_5 = price, ETH_higt_5 = price, ETH_low_5 = price, ETH_price_5 = price}
                    //如果分鐘除五的餘數不等於零，ETH_flag_5=true
                    if(min % 5 != 0 && ETH_flag_5 == false){ ETH_flag_5 = true }
                    //如果分鐘除五的餘數等於零和ETH_flag_5＝true，執行a否則b
                    if(min % 5 == 0 && ETH_flag_5 == true){ 
                        ETH_flag_5 = false
                        //把以前的資料覆蓋過去
                        ETH_open_5 = price, ETH_higt_5 = price, ETH_low_5 = price, ETH_price_5 = price
                    }else{
                        //取得當前價格
                        ETH_price_5 = price
                        //如果當前價格大於最高點，最高點會等於當前價格
                        if(ETH_higt_5 < price) ETH_higt_5 = price;
                        //如果當前價格小於最低點，最低點會等於當前價格
                        if(ETH_low_5 > price) ETH_low_5 = price;
                    }
                    //列印出ETH5分鐘的最高、開盤、現價(收盤)、最低
                    console.log("ETH_5min:" + ETH_higt_5 + " " + ETH_open_5 + " " +  ETH_price_5 + " " + ETH_low_5)
                    // ETH_30
                    if(ETH_open_30 == 0) {ETH_open_30 = price, ETH_higt_30 = price, ETH_low_30 = price, ETH_price_30 = price}
                    if(min % 30 != 0 && ETH_flag_30 == false){ ETH_flag_30 = true }
                    if(min % 30 == 0 && ETH_flag_30 == true){ 
                        ETH_flag_30 = false
                        ETH_open_30 = price, ETH_higt_30 = price, ETH_low_30 = price, ETH_price_30 = price
                    }else{
                        ETH_price_30 = price
                        if(ETH_higt_30 < price) ETH_higt_30 = price;
                        if(ETH_low_30 > price) ETH_low_30 = price;
                    }
                    console.log("ETH_30min:" + ETH_higt_30 + " " + ETH_open_30 + " " +  ETH_price_30 + " " + ETH_low_30)
                }
                
                //BTC
                if(ID == "BTC-USD"){
                    //BTC_1
                    if(BTC_open_1 == 0) {BTC_1_min = min, BTC_open_1 = price, BTC_higt_1 = price, BTC_low_1 = price, BTC_price_1 = price}
                    if(min != BTC_1_min && BTC_flag_1 == false){ BTC_flag_1 = true, BTC_1_min = min }
                    if(min == BTC_1_min && BTC_flag_1 == true){ 
                        BTC_flag_1 = false
                        BTC_open_1 = price, BTC_higt_1 = price, BTC_low_1 = price, BTC_price_1 = price
                    }else{
                        BTC_price_1 = price
                        if(BTC_higt_1 < price) BTC_higt_1 = price;
                        if(BTC_low_1 > price) BTC_low_1 = price;
                    }
                    
                    var Kinfo = {coin:"BTCUSDT_1m",
                                h:BTC_higt_1,
                                l:BTC_low_1,
                                o:BTC_open_1,
                                c:BTC_price_1
                            }
                    var tick = JSON.stringify(Kinfo);
                    var Cdata = JSON.parse(tick);
                    DisplayKinfo("",Cdata,"")
                    //console.log("BTC_1min:" + BTC_higt_1 + " " + BTC_open_1 + " " +  BTC_price_1 + " " + BTC_low_1)

                    // BTC_5
                    if(BTC_open_5 == 0) {BTC_open_5 = price, BTC_higt_5 = price, BTC_low_5 = price, BTC_price_5 = price}
                    if(min % 5 != 0 && BTC_flag_5 == false){ BTC_flag_5 = true }
                    if(min % 5 == 0 && BTC_flag_5 == true){ 
                        BTC_flag_5 = false
                        BTC_open_5 = price, BTC_higt_5 = price, BTC_low_5 = price, BTC_price_5 = price
                    }else{
                        BTC_price_5 = price
                        if(BTC_higt_5 < price) BTC_higt_5 = price;
                        if(BTC_low_5 > price) BTC_low_5 = price;
                    }
                    var Kinfo = {coin:"BTCUSDT_5m",
                    h:BTC_higt_5,
                    l:BTC_low_5,
                    o:BTC_open_5,
                    c:BTC_price_5
                    }
                    var tick = JSON.stringify(Kinfo);
                    var Cdata = JSON.parse(tick);
                    DisplayKinfo("",Cdata,"")
                    //console.log("BTC_5min:" + BTC_higt_5 + " " + BTC_open_5 + " " +  BTC_price_5 + " " + BTC_low_5)
                    // BTC_30
                    if(BTC_open_30 == 0) {BTC_open_30 = price, BTC_higt_30 = price, BTC_low_30 = price, BTC_price_30 = price}
                    if(min % 30 != 0 && BTC_flag_30 == false){ BTC_flag_30 = true }
                    if(min % 30 == 0 && BTC_flag_30 == true){ 
                        BTC_flag_30 = false
                        BTC_open_30 = price, BTC_higt_30 = price, BTC_low_30 = price, BTC_price_30 = price
                    }else{
                        BTC_price_30 = price
                        if(BTC_higt_30 < price) BTC_higt_30 = price;
                        if(BTC_low_30 > price) BTC_low_30 = price;
                    }
                    var Kinfo = {coin:"BTCUSDT_30m",
                    h:BTC_higt_30,
                    l:BTC_low_30,
                    o:BTC_open_30,
                    c:BTC_price_30
                }
                    var tick = JSON.stringify(Kinfo);
                    var Cdata = JSON.parse(tick);
                    DisplayKinfo("",Cdata,"")
                    //console.log("BTC_30min:" + BTC_higt_30 + " " + BTC_open_30 + " " +  BTC_price_30 + " " + BTC_low_30)
                }

                //DOGE
                if(ID == "DOGE-USD"){
                    //DOGE_1
                    if(DOGE_open_1 == 0) {DOGE_1_min = min, DOGE_open_1 = price, DOGE_higt_1 = price, DOGE_low_1 = price, DOGE_price_1 = price}
                    if(min != DOGE_1_min && DOGE_flag_1 == false){ DOGE_flag_1 = true, DOGE_1_min = min }
                    if(min == DOGE_1_min && DOGE_flag_1 == true){ 
                        DOGE_flag_1 = false
                        DOGE_open_1 = price, DOGE_higt_1 = price, DOGE_low_1 = price, DOGE_price_1 = price
                    }else{
                        DOGE_price_1 = price
                        if(DOGE_higt_1 < price) DOGE_higt_1 = price;
                        if(DOGE_low_1 > price) DOGE_low_1 = price;
                    }
                    console.log("DOGE_1min:" + DOGE_higt_1 + " " + DOGE_open_1 + " " +  DOGE_price_1 + " " + DOGE_low_1)
                    // DOGE_5
                    if(DOGE_open_5 == 0) {DOGE_open_5 = price, DOGE_higt_5 = price, DOGE_low_5 = price, DOGE_price_5 = price}
                    if(min % 5 != 0 && DOGE_flag_5 == false){ DOGE_flag_5 = true }
                    if(min % 5 == 0 && DOGE_flag_5 == true){ 
                        DOGE_flag_5 = false
                        DOGE_open_5 = price, DOGE_higt_5 = price, DOGE_low_5 = price, DOGE_price_5 = price
                    }else{
                        DOGE_price_5 = price
                        if(DOGE_higt_5 < price) DOGE_higt_5 = price;
                        if(DOGE_low_5 > price) DOGE_low_5 = price;
                    }
                    console.log("DOGE_5min:" + DOGE_higt_5 + " " + DOGE_open_5 + " " +  DOGE_price_5 + " " + DOGE_low_5)
                    // DOGE_30
                    if(DOGE_open_30 == 0) {DOGE_open_30 = price, DOGE_higt_30 = price, DOGE_low_30 = price, DOGE_price_30 = price}
                    if(min % 30 != 0 && DOGE_flag_30 == false){ DOGE_flag_30 = true }
                    if(min % 30 == 0 && DOGE_flag_30 == true){ 
                        DOGE_flag_30 = false
                        DOGE_open_30 = price, DOGE_higt_30 = price, DOGE_low_30 = price, DOGE_price_30 = price
                    }else{
                        DOGE_price_30 = price
                        if(DOGE_higt_30 < price) DOGE_higt_30 = price;
                        if(DOGE_low_30 > price) DOGE_low_30 = price;
                    }
                    console.log("DOGE_30min:" + DOGE_higt_30 + " " + DOGE_open_30 + " " +  DOGE_price_30 + " " + DOGE_low_30)
                }
            };

    function CreateKlineTable(){
        var Ktable = document.getElementById("Ktable");
        var tr,td;
        var i=0;
        for (k = 0; k < 24; k++) {  
            if (k % 4 == 0) { 
                tr = Ktable.appendChild(document.createElement('tr')); 
                th = tr.appendChild(document.createElement('th'));
                th.innerHTML += K[i];
                //console.log(i);
                i+=1;
            }
            else {
                td = tr.appendChild(document.createElement('td'));
                if(k<4){ //space for LOGO
                    td.setAttribute("id","photo"+k);
                }
                else if(k<8){ //space for price
                    td.setAttribute("id",exchange[k-5]+kline[0]);
                }
                else if(k<12){ //space for high
                    td.setAttribute("id",exchange[k-9]+kline[1]);
                }
                else if(k<16){ //space for low
                    td.setAttribute("id",exchange[k-13]+kline[2]);
                }
                else if(k<20){ //space for open
                    td.setAttribute("id",exchange[k-17]+kline[3]);
                }
                else if(k<24){ //space for close
                    td.setAttribute("id",exchange[k-21]+kline[4]);
                }
            } 
        }
    }

    function InputLogo(){
        var image1= new Image();
        image1.src = "./asset/binance-logo .jpeg";
        image1.width = "72";
        image1.height = "20";
        $("#photo1").html(image1);
    
        var image2= new Image();
        image2.src = "./asset/coinbase_logo.svg";
        image2.width = "72";
        image2.height = "24";
        $("#photo2").html(image2);
    
        var image3= new Image();
        image3.src = "./asset/Huobi-logo.png";
        image3.width = "72";
        image3.height = "24";
        $("#photo3").html(image3);
    }

    CreateKlineTable();
    InputLogo();
}

var exchange=["B","C","H"];
var time=[1,5,30];
var kline = ["p","h","l","o","c"];
var K = ["","price","high","low","open","close"];

function DisplayKinfo(Bdata,Cdata,Hdata){
    //回傳選了什麼幣種
    var selectCC = document.getElementById("Cryptocurrency");
    var valueCC = selectCC.options[selectCC.selectedIndex].value;
    //回傳選了幾分k
    var selectK = document.getElementById("K_stream");
    var valueK = selectK.options[selectK.selectedIndex].value;
    //對照index.html
    var coin = ["B" , "E" , "D"];
    //Binance
    var Bcoin = ["BTCUSDT","ETHUSTD","DOGEUSTD"];
    var stream = ["1m", "5m" , "30m"];

    //Huobi
    var Hb_1 = 'market.btcusdt.kline.1min';
    var Hb_5 = 'market.btcusdt.kline.5min';
    var Hb_30 = 'market.btcusdt.kline.30min';

    //Coinbase
    var Cb_1 = 'BTCUSDT_1m';
    var Cb_5 = 'BTCUSDT_5m';
    var Cb_30 = 'BTCUSDT_30m';

    function inputData_Binance(){
        let BB = ['Bp','Bh','Bl','Bo','Bc'];
        let BV = [Bdata['k']['c'],Bdata['k']['h'],Bdata['k']['l'],Bdata['k']['o'],Bdata['k']['c']];
        


        for (i=0;i<5;i++)
        {
            BV[i]=parseFloat(BV[i]);
            console.log(typeof(BV[i]));
            document.getElementById(BB[i]).innerHTML = BV[i];

        }

    }

    function inputData_Huobi(){
        let HH = ['Hp','Hh','Hl','Ho','Hc'];
        let HV = [Hdata['tick']['close'],Hdata['tick']['high'],Hdata['tick']['low'],Hdata['tick']['open'],Hdata['tick']['close']];
        for (i=0;i<5;i++)
        {
            document.getElementById(HH[i]).innerHTML = HV[i];
        }
    }

    function inputData_Coinbase(){
        let CC = ['Cp','Ch','Cl','Co','Cc'];
        let CV = [Cdata['c'],Cdata['h'],Cdata['l'],Cdata['o'],Cdata['c']];
        for (i=0;i<5;i++)
        {
            document.getElementById(CC[i]).innerHTML = CV[i];
        }
    }
    
//-------------------------------------------------------------------
    //BTC
    if(valueCC == coin[0] && valueK == stream[0] && Hb_1 == Hdata['ch']){
        //Huobi
        //console.log(Hdata);
        inputData_Huobi();

    }
    else if(valueCC == coin[0] && valueK == stream[1] && Hb_5 == Hdata['ch']){
        //Huobi
        //console.log(Hdata);
        inputData_Huobi();
    }
    else if(valueCC == coin[0] && valueK == stream[2] && Hb_30 == Hdata['ch']){
        //Huobi
        //console.log(Hdata);
        inputData_Huobi();

    }
    
    
    if(valueCC == coin[0] && Bcoin[0]==Bdata['s']){
        if(valueK == stream[0] && valueK == Bdata.k.i){
            //Binance Data
            ////Bdata是回傳值，k是回傳值內的k棒，i是每根k棒時間
            inputData_Binance();
        }
        else if(valueK == stream[1] && valueK == Bdata.k.i){
            //Binance
            inputData_Binance();
        }
        else if(valueK == stream[2] && valueK == Bdata.k.i){
            //Binance
            inputData_Binance();
        }
    }
        
    if(valueCC == coin[0] && valueK == stream[0] && Cb_1 == Cdata['coin']){
        inputData_Coinbase();
    }
    else if(valueCC == coin[0] && valueK == stream[1] && Cb_5 == Cdata['coin']){
        inputData_Coinbase();

    }
    else if(valueCC == coin[0] && valueK == stream[2] && Cb_30 == Cdata['coin']){
        inputData_Coinbase();

    }

    //-------------------------------------------------------------------
    //ETH
    //-------------------------------------------------------------------
    //DOGE
    
    Spread_info();   
}

var sum=0;
function alarm(spread,tid){
    let st0 = document.getElementById("st0");
    let st1 = document.getElementById("st1");
    let st2 = document.getElementById("st2");
    let st = [st0,st1,st2];

    let BvC_o = document.getElementById("BvC_o");
    let CvH_o = document.getElementById("CvH_o");
    let HvB_o = document.getElementById("HvB_o");
    let opp = [BvC_o,CvH_o,HvB_o];
   

    if(spread>=0.5 && spread != Infinity){
        if(tid == 0){
            st[0].classList.add("change");
            opp[0].innerHTML-=-1;
            sum++;
            
        }
        else if(tid == 1){
            st[1].classList.add("change");
            opp[1].innerHTML-=-1;
            sum++;
        }
        else if(tid == 2){
            st[2].classList.add("change");
            opp[2].innerHTML-=-1;
            sum++;
        }

    }else{
        if(tid == 0){
            st[0].classList.remove("change");
        }
        else if(tid == 1){
            st[1].classList.remove("change");
        }
        else if(tid == 2){
            st[2].classList.remove("change");
        }
    }
    
    document.getElementById("opt").innerHTML=sum;
         
}

function Spread_info(){
   var Ktable = document.getElementById("Ktable");
    var binance = Ktable.rows[1].cells[1].innerHTML;
    var coinbase = Ktable.rows[1].cells[2].innerHTML;
    coinbase = parseFloat(coinbase);
    //coinbase = coinbase.toFixed(2);
    var huobi = Ktable.rows[1].cells[3].innerHTML;
    //huobi = parseFloat(huobi);//.toFixed(2);
    var coin =  [binance,coinbase,huobi];
    //console.log(binance,coinbase,huobi);

    var BvC_s = document.getElementById("BvC_s");
    var BvC_p = document.getElementById("BvC_p");
    var CvH_s = document.getElementById("CvH_s");
    var CvH_p = document.getElementById("CvH_p");
    var HvB_s = document.getElementById("HvB_s");
    var HvB_p = document.getElementById("HvB_p");
    
    var s0 = Math.abs(coin[0]-coin[1]);
    var s1 = Math.abs(coin[1]-coin[2]);
    var s2 = Math.abs(coin[2]-coin[0]);
    // console.log("s: "+s0,s1,s2);
    // console.log("c: "+coin[0]+":"+coin[1]+":"+coin[2]);

    if(coin[0]>coin[1]){
        let spread = (s0/coin[1])*100;
        BvC_s.innerHTML = s0.toFixed(6);
        BvC_p .innerHTML= spread.toFixed(6)+" %";
    }else
    {
        let spread =(s0/coin[0])*100;
        BvC_s.innerHTML = s0.toFixed(6);
        BvC_p.innerHTML = spread.toFixed(6)+" %";
        alarm(spread,0);
    }

    if(coin[1]>coin[2]){
        let spread = (s1/coin[2])*100;
        CvH_s.innerHTML= s1.toFixed(6);
        CvH_p.innerHTML=spread.toFixed(6)+" %";
        alarm(spread,1);
    }else
    {
        let spread = (s1/coin[1])*100;
        CvH_s.innerHTML= s1.toFixed(6);
        CvH_p.innerHTML=spread.toFixed(6)+" %";
        alarm(spread,1);
    }

    if(coin[2]>coin[0]){
        let spread = (s2/coin[0])*100;
        HvB_s.innerHTML= s2.toFixed(6);
        HvB_p.innerHTML=spread.toFixed(6)+" %";
        alarm(spread,2);
    }else
    {
        let spread = (s2/coin[2])*100;
        HvB_s.innerHTML= s2.toFixed(6);
        HvB_p.innerHTML=spread.toFixed(6)+" %";
        alarm(spread,2);
    }  

}

function openChart(evt, exchangeName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(exchangeName).style.display = "block";
    evt.currentTarget.className += " active";
  }
