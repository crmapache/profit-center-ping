import React  from 'react';
import Button from './components/Button/Button';
import ping   from './utils/ping';

/**
 * Pinging remote address based on favicon.ico
 *
 * If checking address doesn't have favicon or not available, you will see errors
 * or response time if it is available
 *
 * I didn't follow the style instructions, because it's ugly 🤮, but obviously i can do that 😂
 */
class App extends React.Component {
  constructor() {
    super();
    this.ATTEMPTS_NUMBER = 5;
    
    this.TYPE_URL_STATUS_CODE   = 0;
    this.CHECK_URL_STATUS_CODE  = 1;
    this.PROCESSING_STATUS_CODE = 2;
    this.FAIL_STATUS_CODE       = 3;
    this.SUCCESS_STATUS_CODE    = 4;
    
    this.statuses = [
      'Enter the correct server url',
      'You can ping that URL now',
      'Processing...',
      'Probably server is not available',
      'Successfully completed',
    ];
    
    this.state = {
      /**
       * Results of requiests
       */
      results: [],
      /**
       * Current input value
       */
      addr:       'https://profitcenterfx.com/',
      statusCode: this.CHECK_URL_STATUS_CODE,
      /**
       * The remote address results for which you see now
       */
      pingingAddr: '',
    };
  }
  
  requiest = (addr, n) => {
    ping(addr).then(response => {
      n--;
      
      this.setState({results: [...this.state.results, response]});
      
      if (n > 0) {
        setTimeout(() => {
          return this.requiest(addr, n);
        }, 500);
      } else {
        const code = response.status ? this.SUCCESS_STATUS_CODE : this.FAIL_STATUS_CODE;
        this.setState({statusCode: code});
      }
    });
  };
  
  inputHandler = e => {
    if (this.state.statusCode === this.PROCESSING_STATUS_CODE) {
      return;
    }
    
    const code = this.validateURL(e.target.value) ?
        this.CHECK_URL_STATUS_CODE :
        this.TYPE_URL_STATUS_CODE;
    
    this.setState({
      addr:       e.target.value,
      statusCode: code,
    });
  };
  
  buttonClickHandler = () => {
    const code = this.PROCESSING_STATUS_CODE;
    const addr = this.state.addr;
    
    this.setState({
      results:     [],
      statusCode:  code,
      pingingAddr: addr,
    });
    
    this.requiest(this.trimURL(this.state.addr), this.ATTEMPTS_NUMBER);
  };
  
  /**
   * Simpliest url checking
   */
  validateURL = url => {
    return /^(http|https):\/\/.+$/.test(url);
  };
  
  /**
   * Trim url, because i don't wanna show error if user type
   * not root address of site
   *
   * @param url
   * @return {string|*}
   */
  trimURL = url => {
    const splitted = url.split('/');
    
    if (splitted[0] && splitted[2]) {
      return `${splitted[0]}//${splitted[2]}`;
    }
    
    return url;
  };
  
  render() {
    const isButtonDisabled = () => {
      return [this.TYPE_URL_STATUS_CODE, this.PROCESSING_STATUS_CODE].includes(this.state.statusCode);
    };
    
    const results = () => {
      return this.state.results.map((el, i) => {
        const classes = ['result'];
        let title     = 'error';
        
        if (el.status) {
          title = `${el.time} ms`;
        } else {
          classes.push('error');
        }
        
        return (<div className={classes.join(' ')} key={i}>{title}</div>);
      });
    };
    
    const addr = () => {
      if (this.state.pingingAddr) {
        return <div className={'addr'}>{this.state.pingingAddr}</div>;
      }
      
      return null;
    };
    
    return (
        <div className={'app'}>
          <div className={'status'}>
            {this.statuses[this.state.statusCode]}
          </div>
          <div className={'input-wrap'}>
            <input type="text" value={this.state.addr} onInput={this.inputHandler}/>
            <Button
                title={'Ping It!'}
                color={'success'}
                click={this.buttonClickHandler}
                disabled={isButtonDisabled()}
            />
          </div>
          <div className={'result-wrap'}>
            {addr()}
            {results()}
          </div>
        </div>
    );
  }
}


export default App;
