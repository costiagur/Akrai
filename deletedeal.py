import dblite
import os

def deletedeal(akrainum):
    db = dblite.dblite()

    resarr = db.db_delete(akrainum)

    db.close()

    for eachfile in os.listdir('.\\tfasim'):
        if eachfile.startswith(akrainum):
            os.remove('.\\tfasim\\{}'.format(eachfile))
        #
    #

    return resarr