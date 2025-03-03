import base64

def getfile(akrainum):
    dealfile = b''
    
    with open('.\\tfasim\\{}.pdf'.format(akrainum),'rb') as f:
        dealfile = f.read()
    #
    
    return ["{}.pdf".format(akrainum),base64.b64encode(dealfile).decode()]