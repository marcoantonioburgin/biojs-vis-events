//    var iannUrl = "http://localhost:8983/solr/iannData/select/?q=*:*&rows=1&fl=start,title,country,provider,link&fq=end%3A[NOW%20TO%20*]&wt=json&json.wrf=?";
   // var iannUrl = "http://localhost:8983/solr/iannData/select/?q=*:*&rows=1&fl=start,title,country,provider,link&fq=end%3A[NOW%20TO%20*]&wt=json&json.wrf=?";


var iannList = new Object();

/**
 * Display the Events
 * fieldText {string} Fields search - "bioinformatics", "biotherapeutics", "epidemiology", "epigenomics", "genomics", "immunology", "medicine", "metabolomics", "metagenomics", "pathology", "pharmacology", "physiology", "proteomics", "systems biology"
 * fieldOperator {string} Logical operator - "OR", "AND", "NOT"
 * rowsNumber {number} Indicates the maximum number of events that will be shown on the screen
 */
iannList.start = function (fieldText, fieldOperator, rowsNumber, sizeNumber){

   var newUrl = iannList.getNewUrl(fieldText, fieldOperator, rowsNumber);

   iannList.getData(newUrl, sizeNumber);   
};

/**
 * Create a url
 * fieldText {string} Fields search - "bioinformatics", "biotherapeutics", "epidemiology", "epigenomics", "genomics", "immunology", "medicine", "metabolomics", "metagenomics", "pathology", "pharmacology", "physiology", "proteomics", "systems biology"
 * fieldOperator {string} Logical operator - "OR", "AND", "NOT"
 * rowsNumber {number} Indicates the maximum number of events that will be shown on the screen
 */
iannList.getNewUrl = function(fieldText, fieldOperator, rowsNumber){

    var urlText = "";
    var marksText = '"';
    var i = 0;

    while (i < fieldText.length) {

        urlText += marksText+fieldText[i]+marksText;
        
        i++;

        if(i < fieldText.length){urlText +=fieldOperator}

    }

    var iannUrl = "http://iann.pro/solr/select/?q=field:"+urlText+"&rows="+rowsNumber+"&fl=start,title,country,provider,link&fq=end%3A[NOW%20TO%20*]&wt=json&json.wrf=?&sort=start%20asc";
   

    console.log("My url : " + iannUrl);


    return iannUrl;
};

/**
 * Makes a Request to the Server
 * newUrl {string} url - Uniform Resource Locator 
 */
iannList.getData = function(newUrl, sizeNumber){

 jQuery.ajax({
            type      : "GET",
            url       : newUrl,
            dataType  : 'json',
            success   : function(data){processResults(data, sizeNumber);},
            error     : function(e){processError(e);}
        });

};

/**
 * Validates Data
 * data {object Object} 
 */
var processResults = function(data, sizeNumber) {
//alert(JSON.stringify(data.response.docs[0]));
    if(data.response != undefined){
        if(data.response.docs != undefined){
            buildList(data.response.docs, sizeNumber);
        } else {    
            console.log(processError("data.response.docs undefined"));
        }
    } else {
        console.log(processError("data.response undefined"));
    }
}

var processError = function(error) {
    console.log("ERROR:" + error);  
}

/**
 * Build the List
 * docs {object Object} 
 */
var buildList = function(docs, sizeNumber){
    var target = jQuery('#iAnnList');
    target.html('');
    var table = jQuery('<div class="iannEventList"></div>').appendTo(target);
    jQuery('<div class="more-link"><a href="http://iann.pro/iannviewer">More events</a></div>').appendTo(target);
    var oddRow = true;
    jQuery.each(docs, function(rowIndex, rowData) { 
        //cols => Object
        var cols = {'start':'','title':'','link':'','country':'','provider':''};
       
        jQuery.each(cols, function(colsIndex, colsData) {
  

            console.log("%%%%%%%% colsIndex: "+colsIndex);
          

            var field = rowData[colsIndex];
 
            console.log("field: "+field);


            
            if(colsIndex == 'start'){


                console.log(">>>>>Data filtrado: "+ typeof field);

                field = field.substring(0,10); 


                
               //  console.log(">>>>>Data filtrado: "+field);

                 date = field.split("-");    
                 field = date[2] + "-" + date[1] + "-" + date[0]; 
            }

            cols[colsIndex] = field;

            //colsIndex =  start
            console.log("      colsIndex =  "+colsIndex);
            
            //cols[colsIndex] =  01-06-2015
            console.log("      cols[colsIndex] =  "+field);



            //console.log(" O QUE EH O COLS?? =  "+cols.start);


        });

        //Objeto com todos as informacoes
        var iAnnDate = cols['start'].split("-");

        console.log("iAnnDate = "+iAnnDate);

        var date = new Date();

        console.log("date = "+date);


        date.setFullYear(iAnnDate[2],iAnnDate[1]-1,iAnnDate[0]);
        date = date.toString();

                console.log("date2 = "+date);


switch (sizeNumber) {

    case 1:
        
        var row = jQuery('<div><div class="iAnnEventTitleOdd">'+cols['title']+'</div><ul class="blockInformation"><li><i class="fa fa-calendar-o"></i><span class="date">'+date.substring(0,15)+'</span> </li><li><i class="fa fa-map-marker"> </i> <span class="location">'+cols['country']+' - '+cols['provider']+'</span> </li></ul></div>');
        $(".iannEventList").css({width: "12%"});
       

        console.log("cols['title'] = "+cols['title']);


        break;

    case 2:      
        
        var row = jQuery('<div><div class="iAnnEventTitleOdd"><a href="'+cols['link']+'" taget="_blank">'+cols['title']+'</a></div><ul class="blockInformation"><li><i class="fa fa-calendar-o"></i><span class="date">'+date.substring(0,15)+'</span><i class="fa fa-map-marker"></i><span class="location">'+cols['country']+' - '+cols['provider']+'</span></li></ul></div>');
        $(".iannEventList").css({width: "20%"});   
        break;


    case 3:       
        
        var row = jQuery('<div><div class="iAnnEventTitleOdd"><a href="'+cols['link']+'" taget="_blank">'+cols['title']+'</a></div><ul class="blockInformation"><li><i class="fa fa-calendar-o"></i><span class="date">'+date.substring(0,15)+'</span><i class="fa fa-map-marker"></i><span class="location">'+cols['country']+' - '+cols['provider']+'</span></li></ul></div>');
        $(".iannEventList").css({width: "60%", paddingleft: "3%", display: "table"});
        $(".iAnnEventBlockEven").css({width: "32%", margin: "6px auto", float: "left"});
        $(".iAnnEventBlockOdd").css({width: "32%", float: "left"});  
        break;     
    }
    
        if(oddRow == true){                     
            row.addClass("iAnnEventBlockOdd");

            oddRow = false;
        } else {
            row.addClass("iAnnEventBlockEven");
            oddRow = true;
        }

        row.addClass("views-row");
        row.appendTo(table);
    });
};



  
