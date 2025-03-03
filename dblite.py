import sqlite3 as sq
import re
import common
from datetime import date

class dblite: 
    def __init__(self):
        self.con = sq.connect("H:\\Suppliers\\VAT\\Akrai\\akraidb.db")
        self.cur = self.con.cursor()
    #

    def close(self):
        self.con.close()
    #

    def clean(self,param):
        try:                        
            m = re.match(r".'.|" + r'."./g',param) #find any " or ' inside sentence but not at the beginning or end
            
            if m is None: #find any " 
                res = param
            else:
                for eachgroup in m.groups():
                    newtext = eachgroup.replace('"','') #clean group
                    res = param.replace(eachgroup,newtext) #insert clean groups
                #
            #

            return res
        #
        except sq.Error as error:
            common.errormsg("dblite",error)
        #
    #

    def db_insert(self, akrainum, dealdate, dealyear, supid, supname, descr, dealamount, vatamount, nehes, shirut):
        self.cur.execute("INSERT OR IGNORE INTO invoices VALUES(?,?,?,?,?,?,?,?,?,?,?)", 
                         (int(akrainum), dealdate, int(dealyear), int(supid), supname, descr, 
                          float(dealamount.replace(",", "")), float(vatamount.replace(",", "")), nehes, shirut,date.today().strftime("%Y-%m-%d %H:%M:%S")))
        self.con.commit()
        
        self.cur.execute("SELECT * FROM invoices WHERE akrainum=?", (akrainum,))

        return self.cur.fetchall()
    #

    def db_update(self, akrainum, dealdate, dealyear, supid, supname, descr, dealamount, vatamount, nehes, shirut):
        self.cur.execute("UPDATE invoices SET dealdate=?, dealyear=?, supid=?, supname=?, descr=?, dealamount=?, vatamount=?, nehes=?, shirut=?,regdate=? WHERE akrainum=?", 
                         (dealdate, dealyear, supid, supname, descr, float(dealamount.replace(",", "")), float(vatamount.replace(",", "")), nehes, shirut, 
                          date.today().strftime("%Y-%m-%d %H:%M:%S"),int(akrainum)))
        self.con.commit()
        
        self.cur.execute("SELECT * FROM invoices WHERE akrainum=?", (akrainum,))

        return self.cur.fetchall()
    #

    def db_delete(self, akrainum):
        self.cur.execute("DELETE FROM invoices WHERE akrainum=?", (akrainum,))
        self.con.commit()

        return self.cur.rowcount
    #

    def db_select(self, akrainum, dealyear, supid, supname):
        reqstr = "SELECT * FROM invoices WHERE 1"
        if akrainum != "":
            reqstr += " AND akrainum=" + akrainum
        #
        if dealyear != "" and dealyear != "0":
            reqstr += " AND dealyear=" + dealyear
        #
        if supid != "" and supid != "0":
            reqstr += " AND supid=" + supid        
        #
        if supname != "":
            reqstr += " AND supname LIKE '%" + supname + "%'"
        #

        print(reqstr)

        self.cur.execute(reqstr)
        return self.cur.fetchall()
    #

#



