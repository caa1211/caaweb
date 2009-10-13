(function($){

   $.fn.VDwrap = function(){
   
   var sendDate={
     port1: {status: 'off'},
     port2: {status: 'off'},
     rj1: {status: 'off'},
     rj2: {status: 'off'},
     rj3: {status: 'off'},
     rj4: {status: 'off'},
     rj1_left: {status: 'off'},
     rj2_left: {status: 'off'},
     rj3_left: {status: 'off'},
     rj4_left: {status: 'off'},
     rj1_right: {status: 'off'},
     rj2_right: {status: 'off'},
     rj3_right: {status: 'off'},
     rj4_right: {status: 'off'}
   }
   
   var rjMapping = function(rj, rjLeft, rjRight, port){
       rj.status = port.status1 == 'off' && port.status2 == 'off' ? 'off' : 'on';
       rj.msg = port.msg;
       rjLeft.status = port.status1;
       rjRight.status = port.status2;
   }
   
this.setValue = function(date){

sendDate.port1  = $.extend(sendDate.port1, date.port1);
sendDate.port2  = $.extend(sendDate.port2, date.port2);

rjMapping(sendDate.rj1,sendDate.rj1_left, sendDate.rj1_right, date.p1 );
rjMapping(sendDate.rj2,sendDate.rj2_left, sendDate.rj2_right, date.p2 );
rjMapping(sendDate.rj3,sendDate.rj3_left, sendDate.rj3_right, date.p3 );
rjMapping(sendDate.rj4,sendDate.rj4_left, sendDate.rj4_right, date.p4 );
 
vdObj.setValue(sendDate);
}

var vdObj;
  var _handler = function(){
       


vdObj=$(this).VDcomponent();
   };
        
        return this.each(_handler);
  };
    
})(jQuery);
