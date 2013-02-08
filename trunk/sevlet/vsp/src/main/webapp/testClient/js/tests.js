module("Module A");
//-------------------------------
test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
});
//-------------------------------
function isEven(val){
    return val % 2 === 0 ;
}

test("isEven()", function(){
    ok(isEven(0), 'Zero is an event number');
    ok(isEven(2), 'So is two');
    ok(isEven(3), 'So is Tree');
});
//-------------------------------
function sayHi(name) {
    return "Hi, " + name;
};

test('sayHi()', function() {
    equal(sayHi("Jack"), "Hi, Jack", "function outputs string correctly")

});
//------------------------------
   module("Module B"); 
    test("a basic test example", function() {  
            ok( true, "this test is fine" );  
            var value = "hello";  
            QUnit.equal( "hello", value, "We expect value to be hello" );  
        }); 
//------------------------------
(function() {
 var instagramwrapper = {
   oembed: {
     web_url: "",
   }
 };
 window.instagramwrapper = instagramwrapper;
})();

test('Set Up Tests', function() {
  ok(instagramwrapper, "instagram wrapper is exists and is not undefined");
});

test('oembed', function() {
  ok(instagramwrapper.oembed, "oembed namespace exists");
  instagramwrapper.oembed.web_url = "/vsp/rest/h/agents";
  equal(instagramwrapper.oembed.web_url, "/vsp/rest/h/agents", "Can set the web_url correctly");
});
//------------------------------
