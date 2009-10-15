/*
 * ZyXEL Library 1.0
 * 11/18/2008
 * Copyright(c) 2008-2010, ZyXEL cop.
 * Jerry san
 * hchoe@zyxel.com.tw
 * http://www.zyxel.com
 */
//FIXME : multi-lingual
/* Set each kind of Validation Type */
Ext.apply(Ext.form.VTypes, {
	/* check password validation */
	password : function(val, field) {
		this.passwordText = _T('_zyvtype', '_not_match');
		if (field.confirmTo) {
			var pwd = Ext.getCmp(field.confirmTo);
			return (val == pwd.getValue());
		}
		return true;
	},
	
	/* check object name validation */
	chkName: function(val, field) {
		var result = /^[a-zA-Z_-][\w-]{0,30}$/;
		return result.test(val);
	},
	chkNameText : 'Name is invalid, allow wording is  \'a-z A-Z -_\' and max length is 31 words',
 	
 	/* check ip address validation */
	ipaddr: function(val, field) {
		this.ipaddrText = field.fieldLabel+': IP format error';
		var result = /^((([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))$/;
		if(field.allowZero){
			if(val == '0.0.0.0')
				return true;
			else
				return result.test(val);
		}
		else {
			if(val == '0.0.0.0')
				return false;
			else
				return result.test(val);
		}
	},
 	
 	/* check network mask validation */
	netmask: function(val, field) {
		this.netmaskText = 'Subnet Mask format error.';
		var mask = [255,254,252,248,240,224,192,128];
		var Valid = 0;
		var maskSplit = val.split('.');
		if(maskSplit.length != 4) return false;
		for(var i = 3; i >= 0; i--){
			if(Valid == 0){
				for(var j = 0; j < mask.length; j++) {
					if(parseInt(maskSplit[i], 10) == mask[j]) {
						Valid = 1;
					}
				}
				if((Valid == 0) && (parseInt(maskSplit[i], 10) != 0)) break;
			}
			else {
				if(parseInt(maskSplit[i], 10) != 255)  {
					Valid = 0;
					break;
				}
			}
			if(isNaN(maskSplit[i])) {
				Valid = 0;
				break;
			}
		}
		if(Valid == 0) return false;
		return true;
	},
	
	/* check description validation */
	chkDesc: function(val, field) {
		this.chkDescText = [field.fieldLabel, _T('_zyvtype', '_invalid')].join(':');
		var result = /^[\w\s'\(\)\"\+,\/:=\?;!\*#@$%-]+$/;
		return result.test(val);
	},
	
	/* check domain & hostname validation */
	chkSysDomain: function(val, field) {
		this.chkSysDomainText = [field.fieldLabel, _T('_zyvtype', '_invalid')].join(':');
		var result = /^[a-zA-Z0-9-]+[\.a-zA-Z0-9_-]*$/;
		return result.test(val);
	},

	/* check dial-in string */
	chkDialString: function(val, field) {
		this.chkDialStringText = [field.fieldLabel, _T('_zyvtype', '_invalid')].join(':');
		var result = /^[\w\s'\(\)\+,\/:=!\*#@$%\.&-]+$/;
		return result.test(val);
	},

	/* check snmp string */
	chkSnmpString: function(val, field) {
		this.chkSnmpStringText = [field.fieldLabel, _T('_zyvtype', '_invalid')].join(':');
		var result = /^[a-zA-Z0-9_-]+[a-zA-Z0-9_\.-]*$/;
		return result.test(val);
	},

	chkIP: function(val, field) {
		this.chkIPText = [field.fieldLabel, _T('_zyvtype', '_error_IP')].join(':');
		var result = /^((([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-1]?[0-9]?[0-9])|(2[0-4][0-9])|(25[0-5]))$/;
		return (val == '0.0.0.0' ? (field.allowAnyIP ? true : false) : result.test(val));
	}
	
	/* u can add check function here ... */
}); 

