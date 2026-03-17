export function generateBookmarkletCode(): string {
  const code = `
(async function(){
  try{
    var text;
    try{
      text=await navigator.clipboard.readText();
    }catch(e){
      text=prompt('请粘贴人员信息 JSON:');
    }
    if(!text){alert('未获取到数据');return;}
    var payload=JSON.parse(text);
    if(!payload._mdac_autofill){alert('数据格式不正确，请先在 MDAC 助手中复制人员信息');return;}
    var d=payload.data;

    function setVal(id,val){
      if(!val)return;
      var el=document.getElementById(id);
      if(!el)return;
      if(el.tagName==='SELECT'){
        for(var i=0;i<el.options.length;i++){
          if(el.options[i].value===val){
            el.selectedIndex=i;
            break;
          }
        }
      }else{
        el.value=val;
      }
    }

    function setDate(id,val){
      if(!val)return;
      var parts=val.split('-');
      if(parts.length===3){
        val=parts[2]+'/'+parts[1]+'/'+parts[0];
      }
      var el=document.getElementById(id);
      if(!el)return;
      try{$(el).datepicker('setDate',val);}catch(e){}
      if(!el.value){el.value=val;}
    }

    // Mappings
    var genderMap={'Male':'1','Female':'2'};
    var trvlMap={'Air':'1','Land':'2','Sea':'3'};
    var accomMap={'Hotel':'01','Residence':'02','Others':'99'};
    var stateMap={'Johor':'01','Kedah':'02','Kelantan':'03','Melaka':'04','Negeri Sembilan':'05','Pahang':'06','Pulau Pinang':'07','Perak':'08','Perlis':'09','Selangor':'10','Terengganu':'11','Sabah':'12','Sarawak':'13','Kuala Lumpur':'14','Labuan':'15','Putrajaya':'16'};
    var phoneCode=d.phoneCountryCode?d.phoneCountryCode.replace('+',''):'86';

    // Fill all fields directly, no change events
    setVal('nationality',d.nationality);
    setVal('pob',d.placeOfBirth);
    setVal('region',phoneCode);
    setVal('name',d.fullName);
    setVal('passNo',d.passportNumber);
    setVal('email',d.email);
    setVal('confirmEmail',d.email);
    setVal('mobile',d.phoneNumber);
    setVal('vesselNm',d.flightNumber);
    setVal('accommodationAddress1',d.accommodationAddress);
    setVal('accommodationAddress2',d.accommodationAddress2||'');
    setVal('accommodationPostcode',d.accommodationPostcode);
    setVal('sex',genderMap[d.gender]||'1');
    setVal('trvlMode',trvlMap[d.travelMode]||'1');
    setVal('embark',d.countryOfEmbarkation);
    setVal('accommodationStay',accomMap[d.accommodationType]||'01');
    setVal('accommodationState',stateMap[d.accommodationState]||'');

    // Date fields
    setDate('dob',d.dateOfBirth);
    setDate('passExpDte',d.passportExpiryDate);
    setDate('arrDt',d.arrivalDate);
    setDate('depDt',d.departureDate);

    // City needs state to load first, trigger state change then wait
    if(d.accommodationCity){
      var stateEl=document.getElementById('accommodationState');
      if(stateEl){$(stateEl).trigger('change');}
      await new Promise(function(r){setTimeout(r,1500);});
      var cityEl=document.getElementById('accommodationCity');
      if(cityEl){
        for(var i=0;i<cityEl.options.length;i++){
          if(cityEl.options[i].text.toUpperCase().indexOf(d.accommodationCity.toUpperCase())>=0){
            cityEl.selectedIndex=i;
            break;
          }
        }
      }
    }

    alert('表单已自动填写！请检查所有字段后再提交。');
  }catch(e){
    alert('自动填写出错: '+e.message);
  }
})();
`;

  const minified = code
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

  return `javascript:void ${minified}`;
}
