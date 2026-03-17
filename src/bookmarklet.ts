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

    function setInput(id,val){
      if(!val)return;
      var el=document.getElementById(id);
      if(!el)return;
      el.value=val;
      el.dispatchEvent(new Event('input',{bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
    }

    function setSelect(id,val){
      if(!val)return;
      var el=document.getElementById(id);
      if(!el)return;
      for(var i=0;i<el.options.length;i++){
        if(el.options[i].value===val){
          el.selectedIndex=i;
          break;
        }
      }
      $(el).trigger('change');
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
      if(!el.value){
        el.value=val;
      }
      $(el).trigger('change');
    }

    // Gender mapping: Male->1, Female->2
    var genderMap={'Male':'1','Female':'2'};
    // Travel mode mapping: Air->1, Land->2, Sea->3
    var trvlMap={'Air':'1','Land':'2','Sea':'3'};
    // Accommodation type mapping
    var accomMap={'Hotel':'01','Residence':'02','Others':'99'};
    // State mapping
    var stateMap={'Johor':'01','Kedah':'02','Kelantan':'03','Melaka':'04','Negeri Sembilan':'05','Pahang':'06','Pulau Pinang':'07','Perak':'08','Perlis':'09','Selangor':'10','Terengganu':'11','Sabah':'12','Sarawak':'13','Kuala Lumpur':'14','Labuan':'15','Putrajaya':'16'};

    // Text fields
    setInput('name',d.fullName);
    setInput('passNo',d.passportNumber);
    setInput('email',d.email);
    setInput('confirmEmail',d.email);
    setInput('mobile',d.phoneNumber);
    setInput('vesselNm',d.flightNumber);
    setInput('accommodationAddress1',d.accommodationAddress);
    setInput('accommodationAddress2',d.accommodationAddress2||'');
    setInput('accommodationPostcode',d.accommodationPostcode);

    // Select fields
    setSelect('nationality',d.nationality);
    setSelect('pob',d.placeOfBirth);
    setSelect('sex',genderMap[d.gender]||'1');
    setSelect('region',d.phoneCountryCode?d.phoneCountryCode.replace('+',''):'86');
    setSelect('trvlMode',trvlMap[d.travelMode]||'1');
    setSelect('embark',d.countryOfEmbarkation);
    setSelect('accommodationStay',accomMap[d.accommodationType]||'01');
    setSelect('accommodationState',stateMap[d.accommodationState]||'');

    // Date fields (YYYY-MM-DD -> DD/MM/YYYY via datepicker)
    setDate('dob',d.dateOfBirth);
    setDate('passExpDte',d.passportExpiryDate);
    setDate('arrDt',d.arrivalDate);
    setDate('depDt',d.departureDate);

    // Wait for city dropdown to populate after state selection
    if(d.accommodationCity){
      setTimeout(function(){
        var cityEl=document.getElementById('accommodationCity');
        if(cityEl){
          for(var i=0;i<cityEl.options.length;i++){
            if(cityEl.options[i].text.toUpperCase().indexOf(d.accommodationCity.toUpperCase())>=0){
              cityEl.selectedIndex=i;
              $(cityEl).trigger('change');
              break;
            }
          }
        }
      },1500);
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
