console.log("ConvTool Full Version Loaded");

function openTool(type){
    let area=document.getElementById("toolArea");
    if(type=='pngToJpg'){
        area.innerHTML='<h2>PNG → JPG</h2><input type="file" id="pngJpgInput"><p id="msg"></p>';
        document.getElementById("pngJpgInput").onchange=e=>convertPngToJpg(e);
    }
    if(type=='pngToWebp'){
        area.innerHTML='<h2>PNG → WEBP</h2><input type="file" id="pngWebpInput"><p id="msg"></p>';
        document.getElementById("pngWebpInput").onchange=e=>convertPngToWebp(e);
    }
    if(type=='resize'){
        area.innerHTML='<h2>이미지 리사이즈</h2><input type="file" id="resizeInput"><br>가로:<input id="w" type="number"> 세로:<input id="h" type="number"><button onclick="resizeImage()">변환</button><p id="msg"></p>';
        window._resizeImg=null;
        document.getElementById("resizeInput").onchange=e=>{ _resizeImg=e.target.files[0]; };
    }
    if(type=='compress'){
        area.innerHTML='<h2>JPG/PNG 압축</h2><input type="file" id="compressInput"><br><input id="q" type="range" min="0" max="1" step="0.1" value="0.7"> 품질<p id="msg"></p>';
        document.getElementById("compressInput").onchange=e=>compressImage(e);
    }
    if(type=='toPdf'){
        area.innerHTML='<h2>이미지 → PDF</h2><input type="file" id="pdfInput"><p id="msg"></p>';
        document.getElementById("pdfInput").onchange=e=>convertToPdf(e);
    }
}

function convertPngToJpg(e){
    let f=e.target.files[0]; if(!f)return;
    let img=new Image(); img.src=URL.createObjectURL(f);
    img.onload=()=>{
        let c=document.createElement("canvas");
        c.width=img.width; c.height=img.height;
        c.getContext("2d").drawImage(img,0,0);
        c.toBlob(b=>{
            let a=document.createElement("a");
            a.href=URL.createObjectURL(b);
            a.download=f.name.replace(".png",".jpg");
            a.click();
        },"image/jpeg",0.9);
        msg.innerText="JPG 다운로드 완료";
    }
}

function convertPngToWebp(e){
    let f=e.target.files[0]; if(!f)return;
    let img=new Image(); img.src=URL.createObjectURL(f);
    img.onload=()=>{
        let c=document.createElement("canvas");
        c.width=img.width; c.height=img.height;
        c.getContext("2d").drawImage(img,0,0);
        c.toBlob(b=>{
            let a=document.createElement("a");
            a.href=URL.createObjectURL(b);
            a.download=f.name.replace(".png",".webp");
            a.click();
        },"image/webp",0.9);
        msg.innerText="WEBP 다운로드 완료";
    }
}

function resizeImage(){
    if(!_resizeImg){msg.innerText="이미지 선택하세요";return;}
    let w=document.getElementById("w").value;
    let h=document.getElementById("h").value;
    let img=new Image(); img.src=URL.createObjectURL(_resizeImg);
    img.onload=()=>{
        let c=document.createElement("canvas");
        c.width=w; c.height=h;
        c.getContext("2d").drawImage(img,0,0,w,h);
        c.toBlob(b=>{
            let a=document.createElement("a");
            a.href=URL.createObjectURL(b);
            a.download="resized_"+_resizeImg.name;
            a.click();
        },"image/jpeg",0.9);
        msg.innerText="리사이즈 완료";
    }
}

function compressImage(e){
    let f=e.target.files[0]; if(!f)return;
    let q=document.getElementById("q").value;
    let img=new Image(); img.src=URL.createObjectURL(f);
    img.onload=()=>{
        let c=document.createElement("canvas");
        c.width=img.width; c.height=img.height;
        c.getContext("2d").drawImage(img,0,0);
        c.toBlob(b=>{
            let a=document.createElement("a");
            a.href=URL.createObjectURL(b);
            a.download="compressed_"+f.name;
            a.click();
        },"image/jpeg",q);
        msg.innerText="압축 완료 (품질: "+q+")";
    }
}

function convertToPdf(e){
    let f=e.target.files[0]; if(!f)return;
    let img=new Image(); img.src=URL.createObjectURL(f);
    img.onload=()=>{
        import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(pdf=>{
            const {jsPDF}=pdf;
            let doc=new jsPDF({unit:"px",format:[img.width,img.height]});
            doc.addImage(img,"PNG",0,0,img.width,img.height);
            doc.save(f.name.replace(/\.[^/.]+$/,"")+".pdf");
            msg.innerText="PDF 저장 완료";
        });
    }
}
