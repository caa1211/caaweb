package org.dyndns.stevennick.servlet.model;

public class User extends ResponseBase{
    
    String name;
    String password;
    
    public User(String name, String password) {
        this.name = name ;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        //
        return password;
    }

    public void setPassword(String password) throws Exception {
        if(password == null || password.isEmpty()) {
            throw new Exception("Paasowrd annot be blank!");
        }
        this.password = password;
    }
    
    private void validation() {
        // code
    }
    
    

}
