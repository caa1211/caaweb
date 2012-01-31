	var switchOption = {
	
				id: "vSwitch0",
				label: "Standard Switch: vSwitch0",
				
				VM_Port_Group:
				{
					groupLabel:"Virtual Machine Port Group",
					id: "vm_network",
					label: "VM Network",
					children:[
						{
									  id: "vCenterWine2K3",
									  label: "vCenterWine2K3",
									  status: "on"
						 },
						{
									  id: "vCenterMobileAccess",
									  label: "vCenterMobileAccess",
									  status: "on"
						 }
								
					    ]
				},
				VMkernel_Port_Group:
				{
						groupLabel: "VMkernel Port",
						id: "management_network",
						label:"Management Network",
						children:[
							{
									id:"vmk0",
								    label: "vmk0 : 172.101.35.3"
							}
							]
				},
				Physical_Adapters:
				{
						groupLabel: "Physical Adapters",
						id: "physical_Adapters",
						children:[
							{
									id:"vmnic0",
									label: "vmnic0  1000  Full"	
							},
							{
									id:"vmnic2",
									label: "vmnic2  1000  Full"	
							}
							]
				}

			};

$("#switch0").vlanTable(switchOption);
 