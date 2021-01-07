/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let React;
let ReactDOM;
let ReactTestUtils;

describe('ReactElement', () => {
    let ComponentClass;
    let originalSymbol;

    beforeEach(() => {
        jest.resetModules();

        // Delete the native Symbol if we have one to ensure we test the
        // unpolyfilled environment.
        originalSymbol = global.Symbol;
        global.Symbol = undefined;

        React = require('react');
        ReactDOM = require('react-dom');
        ReactTestUtils = require('test-utils');
        // NOTE: We're explicitly not using JSX here. This is intended to test
        // classic JS without JSX.
        ComponentClass = class extends React.Component {
            render() {
                return React.createElement('div');
            }
        };
    });

    afterEach(() => {
        global.Symbol = originalSymbol;
    });


    it('useEffect执行顺序', () => {
        const container = document.createElement('div');
        const {useEffect, useState} = React;

        const testList = [];

        function App() {
          const [num, updateNum] = useState(0);
          const [num2, updateNum2] = useState(0);
          const [showChild, updateChildShow] = useState(true);

          useEffect(() => {
            testList.push(1);

            return () => testList.push(999);
          }, [])

          // useLayoutEffect(() => {
          //   testList.push(100);

          //   return () => testList.push(99900);
          // }, [])
          

          useEffect(() => {
            testList.push(8);
          })

          // useLayoutEffect(() => {
          //   testList.push(80);
          // })

          useEffect(() => {
            testList.push(13);

            return () => testList.push(14);
          })  
          
          // useLayoutEffect(() => {
          //   testList.push(130);

          //   return () => testList.push(140);
          // })

          useEffect(() => {
            testList.push(9);

            return () => {
              testList.push(10);
            }
          }, [num])
          
          // useLayoutEffect(() => {
          //   testList.push(90);

          //   return () => {
          //     testList.push(100);
          //   }
          // }, [num])

          useEffect(() => {
            testList.push(11);

            return () => {
              testList.push(12);
            }
          }, [num2]) 
          
          // useLayoutEffect(() => {
          //   testList.push(110);

          //   return () => {
          //     testList.push(120);
          //   }
          // }, [num2])
          

          return (
            <div>
              <button ref="a" onClick={() => updateNum(num + 1)}>update num</button>
              <button ref="b" onClick={() => updateNum2(num2 + 1)}>update num2</button>
              <button ref="c" onClick={() => updateChildShow(false)}>delete</button>
              {showChild && <Child num={num} num2={num2}/>}
            </div>
          );
        }

        function Child({num, num2}) {
          useEffect(() => {
            testList.push(2);

            return () => {
              testList.push(3);
            }
          }, [num])
          
          // useLayoutEffect(() => {
          //   testList.push(20);

          //   return () => {
          //     testList.push(30);
          //   }
          // }, [num])

          useEffect(() => {
            testList.push(4);
            return () => {
              testList.push(5);
            }
          }, [])
          
          // useLayoutEffect(() => {
          //   testList.push(40);
          //   return () => {
          //     testList.push(50);
          //   }
          // }, [])

          useEffect(() => {
            testList.push(6);
            return () => {
              testList.push(6);
            }
          }, [num2])
          
          // useLayoutEffect(() => {
          //   testList.push(60);
          //   return () => {
          //     testList.push(60);
          //   }
          // }, [num2])

          useEffect(() => {
            testList.push(15);
            return () => {
              testList.push(16);
            }
          })
          
          // useLayoutEffect(() => {
          //   testList.push(150);
          //   return () => {
          //     testList.push(160);
          //   }
          // })

          useEffect(() => {
            testList.push(17);
            return () => {
              testList.push(18);
            }
          }, [true])
          
          // useLayoutEffect(() => {
          //   testList.push(170);
          //   return () => {
          //     testList.push(180);
          //   }
          // }, [true])

          return <p>num:{num} num2:{num2} <GrandChild/></p>;
        }

        function GrandChild() {
          useEffect(() => {
            testList.push(21);

            return () => {
              testList.push(22);
            }
          })

          // useLayoutEffect(() => {
          //   testList.push(210);

          //   return () => {
          //     testList.push(220);
          //   }
          // })

          useEffect(() => {
            testList.push(23);

            return () => {
              testList.push(24);
            }
          }, [])
          
          // useLayoutEffect(() => {
          //   testList.push(230);

          //   return () => {
          //     testList.push(240);
          //   }
          // }, [])

          return 'grand child';
        }

        const s = ReactDOM.render(<App />, container);

      ReactTestUtils.Simulate.click(s.refs.a);
      ReactTestUtils.Simulate.click(s.refs.a);
      ReactTestUtils.Simulate.click(s.refs.b);
      ReactTestUtils.Simulate.click(s.refs.a);
      ReactTestUtils.Simulate.click(s.refs.b);
      ReactTestUtils.Simulate.click(s.refs.b);
      ReactTestUtils.Simulate.click(s.refs.c);
      ReactTestUtils.Simulate.click(s.refs.a);
      ReactTestUtils.Simulate.click(s.refs.b);

      const rightOrder = '21,23,2,4,6,15,17,1,8,13,9,11,22,21,3,16,2,15,14,10,8,13,9,22,21,3,16,2,15,14,10,8,13,9,22,21,6,16,6,15,14,12,8,13,11,22,21,3,16,2,15,14,10,8,13,9,22,21,6,16,6,15,14,12,8,13,11,22,21,6,16,6,15,14,12,8,13,11,3,5,6,16,18,22,24,14,8,13,14,10,8,13,9,14,12,8,13,11';

      expect(testList.join()).toBe(rightOrder);
    });

});