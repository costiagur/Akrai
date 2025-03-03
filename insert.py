import dblite
import common
import base64
from datetime import datetime

def insert(postdict,dealfile,insertORupdate):
    db = dblite.dblite()

    if insertORupdate == "insert":
        resarr = db.db_insert(postdict["akrainum"], postdict["dealdate"], postdict["dealyear"], postdict["supid"], postdict["supname"], postdict["descr"], postdict["dealamount"], postdict["vatamount"], postdict["nehes"], postdict["shirut"])
    elif insertORupdate == "update":
        resarr = db.db_update(postdict["akrainum"], postdict["dealdate"], postdict["dealyear"], postdict["supid"], postdict["supname"], postdict["descr"], postdict["dealamount"], postdict["vatamount"], postdict["nehes"], postdict["shirut"])
    #
    resarr = resarr[0]

    db.close()

    with open('.\\tfasim\\{}.pdf'.format(postdict["akrainum"]),'wb') as f:
        f.write(dealfile)
    #

    date_object = datetime.strptime(resarr[1], "%Y-%m-%d")
    formatted_date = date_object.strftime("%d/%m/%Y") 

    metroje = '1100000602\t\t{}\t{}\t{}\t{}\t{}\t\n'.format(formatted_date,formatted_date,resarr[5],resarr[0],resarr[7])
    metroje = metroje +'\t7040000039\t{}\t{}\t{}\t{}\t\t{}'.format(formatted_date,formatted_date,resarr[5],resarr[0],resarr[7])

    gviyaje = "לקוח,נכס,סכום,סוג_תנועה,נושא,שרות,שנה,שנה מקורית,תאריך_גביה,יום_ערך,תקופה,קוד פקודת יומן,קוד_פעולה,סוג_פעולה,הערה\n"
    gviyaje = gviyaje + '{},{},{},2,3,{},{},{},{},{},0,108,535,ז,{}\n'.format(resarr[3],resarr[8],-1*resarr[7],
                                                resarr[9],resarr[2],resarr[2],formatted_date,
                                                formatted_date,resarr[0])
    gviyaje = gviyaje + '{},{},{},1,3,{},{},{},{},{},0,108,535,ח,{}'.format(resarr[3],resarr[8],-1*resarr[7],
                                                resarr[9],resarr[2],resarr[2],formatted_date,
                                                formatted_date,resarr[0])

    metrofile = []
    metrobytes = []
    
    for i,eachf in enumerate([metroje,gviyaje]):

        metrofile.append(base64.b64encode(eachf.encode("CP1255")))
    #

    return [[resarr],metrofile[0].decode(),metrofile[1].decode()]
