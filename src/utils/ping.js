const ping = addr => {
  return new Promise(resolve => {
    const img   = new Image();
    const start = new Date().getTime();
    
    const responseHandler = e => {
      resolve({time: new Date().getTime() - start, status: e.type === 'load'});
    };
    
    img.onload = e => {
      responseHandler(e);
    };
    
    img.onerror = e => {
      responseHandler(e);
    };
    
    img.src = `${addr}/favicon.ico?${+new Date()}`;
  });
};

export default ping;