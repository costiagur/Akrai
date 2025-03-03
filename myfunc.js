myfunc = new Object();
//*********************************************************************************** */
myfunc.msg = function(title,msg_txt){
    document.getElementById("msg_title").innerHTML = title
    document.getElementById("msg_txt").innerHTML = msg_txt
    document.getElementById("msg_dg").showModal()
}
//********************************************************************************************* */
myfunc.response = function(inid,intxt){
    document.getElementById(inid + "_res").innerHTML = intxt
    document.getElementById("response_dg").showModal()
}
//********************************************************************************************* */
myfunc.resp_close = function(){
    document.getElementById("response_dg").close();
    
    resnames = document.getElementsByName("inres")
    
    for (resnm of resnames){
        resnm.innerHTML = ""
    }
}
//********************************************************************************************* */
myfunc.sendrequest = function(fdata){
    return new Promise((resolve) =>{    
        var xhr = new XMLHttpRequest();
        xhr.open('POST',"http://localhost:"+ui.port,true)
    
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {   
                console.log(this.responseText)
    
                resobj = JSON.parse(this.responseText);
                resolve(resobj)    
     
            }
            else if (this.readyState == 4 && this.status != 200){
                resolve(["Error",this.responseText])

            }
        }
    
        xhr.send(fdata);   
    })
}

//*********************************************************************************** */
myfunc.submit = async function(){ //request can be insert or update

    arr = ["in1","in2","in3","doc1"]

    for (eacharr of arr){
        files = document.getElementById(eacharr).files
        
        if(files != null){
            if (files.length > 0){
                var fdata = new FormData();
                fdata.append("request",eacharr)
                fdata.append(eacharr,document.getElementById(eacharr).files[0]);
            }
        }
        else{
            if (document.getElementById(eacharr).value != ""){
                var fdata = new FormData();
                fdata.append("request",eacharr)
                fdata.append(eacharr,document.getElementById(eacharr).value);;    
                
            }
        }
    
        const resobj = await myfunc.sendrequest(fdata)
        if ( resobj[0] == "Error"){
            myfunc.msg( resobj[0], resobj[1])
       }
       else{
           if (resobj[0].slice(0,2) == "in"){
               myfunc.response(resobj[0], resobj[1])
           }
           else {
               myfunc.download(resobj[0], resobj[1])
           }
       } 
    }
    
}

//********************************************************************************************* */
myfunc.download = function(filename, filetext){

    var a = document.createElement("a");

    document.body.appendChild(a);

    a.style = "display: none";

    a.href = 'data:application/octet-stream;base64,' + filetext;

    a.download = filename;

    a.click();

    document.body.removeChild(a);

}
//*************************************************************************************************** */               
myfunc.insertdeal = async function(querytype){

    var requiredfileds = document.querySelectorAll("input[required]");
    var fdata = new FormData();
    var checkfields = 0;

    for(let eachone of requiredfileds){
        if (eachone.value == "" || eachone.value == 0){
            eachone.style.backgroundColor = "pink";
            checkfields ++;            
        }   
        else if (eachone.value != "" && eachone.value != 0){
            eachone.style.backgroundColor = "white";
        }
    } 

    if(checkfields>0){return;}

    if(querytype == 'insert' && document.getElementById("loaddeal_in").value == ""){
        document.getElementById("loaddeal_in").style.backgroundColor = "pink";
        return;
    }
    else if(querytype == 'insert' && document.getElementById("loaddeal_in").value != ""){
        document.getElementById("loaddeal_in").style.backgroundColor = "white";
    }

    fdata.append("akrainum", document.getElementById("akrainum_in").value);

    fdata.append("dealdate", document.getElementById("dealdate_in").value);

    fdata.append("dealyear", document.getElementById("dealyear_in").value);

    fdata.append("supid", document.getElementById("supid_in").value);

    fdata.append("supname", document.getElementById("supname_in").value);

    fdata.append("descr", document.getElementById("descr_in").value);

    fdata.append("dealamount", document.getElementById("dealamount_in").value);

    fdata.append("vatamount", document.getElementById("vatamount_in").value);

    fdata.append("dealfile",document.getElementById("loaddeal_in").files[0]);

    fdata.append("nehes", document.getElementById("nehes_in").value);

    fdata.append("shirut", document.getElementById("shirut_in").value);

    if(querytype == 'insert'){

        fdata.append("request", 'insert');
    }
    else if(querytype == 'update'){

        fdata.append("request", 'update');
    }

    const resobj = await myfunc.sendrequest(fdata)
    if (resobj[0] == "Error"){
        myfunc.msg(resobj[0], resobj[1])
    }
    else{
        myfunc.maketable(resobj[1][0]);
        myfunc.download(`${document.getElementById("akrainum_in").value}.txt`,resobj[1][1]);
        myfunc.download(`${document.getElementById("akrainum_in").value}.csv`,resobj[1][2]);
    }
    
}


//************************************************************************************************ */
myfunc.searchdeals = async function(addfile=false){

    var fdata = new FormData();
    
    fdata.append("request", "searchdeals");

    fdata.append("akrainum", document.getElementById("akrainum_in").value);

    fdata.append("dealdate", document.getElementById("dealdate_in").value);

    fdata.append("dealyear", document.getElementById("dealyear_in").value);

    fdata.append("supid", document.getElementById("supid_in").value);

    fdata.append("supname", document.getElementById("supname_in").value);

    fdata.append("descr", document.getElementById("descr_in").value);

    fdata.append("dealamount", document.getElementById("dealamount_in").value);

    fdata.append("vatamount", document.getElementById("vatamount_in").value);

    fdata.append("nehes", document.getElementById("nehes_in").value);

    fdata.append("shirut", document.getElementById("shirut_in").value);

    fdata.append("addfile", (addfile == true) ? 1 : 0);

    const resobj = await myfunc.sendrequest(fdata)
    if (resobj[0] == "Error"){
        myfunc.msg(resobj[0], resobj[1])
    }
    else{
        if (resobj[1] == "" || resobj[1] == "no result returned") {
                myfunc.msg("הודעה","לא הוחזרו נתונים");
        }
        else {
                myfunc.maketable(resobj[1][0]);
                if (resobj[1][1] != ""){
                    myfunc.download("output.xlsx",resobj[1][1]);
                }
        }
    }
}

//****************************************************************************************************** */

myfunc.loaddeal = async function(akrainum){

    var fdata = new FormData();
    var responsedata = "";
    
    fdata.append("akrainum", akrainum);
    fdata.append("dealyear", "");
    fdata.append("supid", "");
    fdata.append("supname", "");
    fdata.append("addfile", 0);

    fdata.append("request", "loaddeal");

    const resobj = await myfunc.sendrequest(fdata)
    if (resobj[0] == "Error"){
        myfunc.msg(resobj[0], resobj[1])
    }
    else{
        if (resobj[1] == "" || resobj[1] == "no result returned") {
            myfunc.msg("הודעה", "לא הוחזרו נתונים")
        }
        else {       
            document.getElementById("akrainum_in").value = resobj[1][0][0][0];

            document.getElementById("dealdate_in").value = resobj[1][0][0][1];

            document.getElementById("dealyear_in").value = resobj[1][0][0][2];

            document.getElementById("supid_in").value = resobj[1][0][0][3];

            document.getElementById("supname_in").value = resobj[1][0][0][4];
            
            document.getElementById("descr_in").value = resobj[1][0][0][5];
                       
            document.getElementById("dealamount_in").value = resobj[1][0][0][6];
            
            document.getElementById("vatamount_in").value = resobj[1][0][0][7];

            document.getElementById("nehes_in").value = resobj[1][0][0][8];

            document.getElementById("shirut_in").value = resobj[1][0][0][9];
        }
    }    
}
/************************************************************************************************ */
myfunc.getfile = async function(akrainum){

    var fdata = new FormData();
    
    fdata.append("request", "getfile");

    fdata.append("akrainum", akrainum);

    const resobj = await myfunc.sendrequest(fdata)
    if (resobj[0] == "Error"){
        myfunc.msg(resobj[0], resobj[1])
    }
    else{
        myfunc.download(resobj[1][0],resobj[1][1])       
    }
    
}

//********************************************************************************************** */
myfunc.clearfields = function(){
                
    var textfileds = document.querySelectorAll("input");

    for(let eachone of textfileds){
        eachone.value = "";
        eachone.backgroundColor = "currentColor";
    }

    document.getElementById("supid_in").value = 0;
    document.getElementById("list_tb_body").innerHTML = "";
}

//**********Delete Contract************************************************************************ */
myfunc.deletedeal = function(){
    if (confirm("האם למחוק את העסקה?") == true) {
        myfunc.deletedeal_final();
    }
}

myfunc.deletedeal_final = async function(){

    var fdata = new FormData();  

    fdata.append("akrainum", document.getElementById("akrainum_in").value);
    fdata.append("request", "deletedeal");

    const resobj = await myfunc.sendrequest(fdata)
    if (resobj[0] == "Error"){
        myfunc.msg(resobj[0], resobj[1])
    }
    else{
        myfunc.msg(resobj[0], `נמחקו ${resobj[1]} רשומות`) 
    } 
}

//***********  MAKE TABLE ******************************************************************/

myfunc.maketable = function(reponsedata){

    var i = 0;
    var tr = "";
    var reply = new Object();
    var startdate = new Object();

    var tbl = ''   
    
    for (eachone of reponsedata){

        tr = `<td><button onclick="myfunc.loaddeal(${eachone[0]})">${eachone[0]}</button"></td>`;
    
        dealdate = new Date(eachone[1]);

        tr += "<td>" + dealdate.toLocaleDateString("en-GB") + "</td>";                   
        tr += "<td>" + eachone[2] + "</td>"; 
        tr += "<td>" + eachone[3] + "</td>";

        supname = eachone[4].replace(/\\'/g,"'");
        supname = supname.replace(/\\"/g,'"');
        supname = supname.replace(/\\/g,"");

        tr += "<td>" + supname + "</td>";
            
        descr = eachone[5].replace(/\\'/g,"'");
        descr = descr.replace(/\\"/g,'"');
        descr = descr.replace(/\\/g,"");

        tr += "<td>" + descr + "</td>";
                
        dealamount = Number(eachone[6]);
        dealamount = dealamount.toLocaleString('en-US'); //format as number with commas
                           
        tr += "<td>" + dealamount + "</td>";

        vatamount = Number(eachone[7]);
        vatamount = vatamount.toLocaleString('en-US'); //format as number with commas
 
        tr += "<td>" + vatamount + "</td>";

        total = Number(eachone[7])+Number(eachone[6])
        tr += "<td>" + total.toLocaleString('en-US') + "</td>";
        tr += `<td><button onclick="myfunc.getfile(${eachone[0]})">קובץ</button></td>`;
        tbl = tbl + "<tr>" + tr + "</tr>";
    }
             
    document.getElementById("list_tb_body").innerHTML = tbl;

}

//*********** Set Year from Deal Date ***************************************************** */

myfunc.setyear = function(){

    var dealdate = new Date(document.getElementById("dealdate_in").value);

    document.getElementById("dealyear_in").value = dealdate.getFullYear();

}

//********** Calc VAT from Deal Amount and backwards ************************************* */

myfunc.calcvat = function(caller){

    if(caller.id == "dealamount_in" && document.getElementById("vatamount_in").value == 0){

        document.getElementById("vatamount_in").value = Math.round(Number(document.getElementById("dealamount_in").value)*0.18);
    }
    else if(caller.id == "vatamount_in" && document.getElementById("dealamount_in").value == 0){

        document.getElementById("dealamount_in").value = Math.round(Number(document.getElementById("vatamount_in").value)/0.18*100)/100;

    }
}