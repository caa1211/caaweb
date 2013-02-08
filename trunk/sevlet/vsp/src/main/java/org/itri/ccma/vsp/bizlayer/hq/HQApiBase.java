package org.itri.ccma.vsp.bizlayer.hq;

import org.hyperic.hq.hqapi1.HQApi;
import org.itri.ccma.vsp.bizlayer.BoObject;

public class HQApiBase extends BoObject{

    //todo: get parameter from cache
    private String  HOST        = "140.96.29.30";//"10.201.100.242";
    private int     PORT        = 7080;
    private int     SSL_PORT    = 7443;
    private boolean IS_SECURE   = true;
    private String  USER        = "hqadmin";
    private String  PASSWORD    = "password";

    HQApi getApi() {
        //return new HQApi(HOST, PORT, IS_SECURE, USER, PASSWORD);
        return getApi(true);
    }

    HQApi getApi(boolean secure) {
        return new HQApi(HOST, SSL_PORT, secure, USER, PASSWORD);
    }

    HQApi getApi(String user, String password) {
        return new HQApi(HOST, PORT, IS_SECURE, user, password);
    }

}
