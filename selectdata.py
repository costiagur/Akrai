import dblite
import common
import pandas as pd
from io import BytesIO
import base64

def selectdata(postdict):
    db = dblite.dblite()

    resarr = db.db_select(postdict["akrainum"], postdict["dealyear"], postdict["supid"], postdict["supname"])

    print(resarr)

    db.close()

    resbytes = b''

    addfile = int(postdict["addfile"])

    if addfile == 1:
        
        df = pd.DataFrame(resarr)

        df.rename(columns={0: 'Akrainum', 1: 'Dealdate', 2: 'Dealyear', 3: 'Supid', 4: 'Supname', 5: 'Descr', 6: 'Dealamount', 7: 'Vatamount', 8: 'Nehes', 9: 'Shirut', 10: 'InputDate'}, inplace=True)

        resfile = BytesIO()

        df.to_excel(resfile, index=False)

        resfile.seek(0)

        resbytes = base64.b64encode(resfile.getvalue())

    #

    return [resarr, resbytes.decode() if addfile == 1 else 0]