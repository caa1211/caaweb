package org.itri.ccma.vsp.servicelayer.response;

public class ServerResponse {
    protected int status;
    protected Object result;
    
    public ServerResponse(int status){ 
        this.status = status;
    }
    
    public ServerResponse(){ 
        this.status = 1;
    }
    
    public ServerResponse(int status, Object result){ 
        this.status = status;
        this.result = result;
    }
    
    public ServerResponse(Object result){ 
        this.status = 1;
        this.result = result;
    }
    
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }


}
