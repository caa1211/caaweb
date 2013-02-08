package org.dyndns.stevennick.servlet.model;

public class ServerResponse {

	private int status;
	private String result;
	private ServerResponse aa;

	public ServerResponse() {

	}

	public ServerResponse(int status, String result) {
		this.status = status;
		this.result = result;
	}

	public ServerResponse(int i, String string, ServerResponse serverResponse) {
        this.aa= serverResponse;
        this.status = i;
        this.result = string;
    }

    public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

    public ServerResponse getAa() {
        return aa;
    }

    public void setAa(ServerResponse aa) {
        this.aa = aa;
    }

}
