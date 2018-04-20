let React
let styled
let injectGlobal

const Arrow = styled.div`
  background-color: blue;
`

const color = 'rebeccapurple'

const RightArrow = styled.div`
  @media screen and (min-width: 480px) {
    background-color: ${color};
    ${Arrow}:hover > & {
      background-color: orange;
    }
  }
`

const LeftArrow = styled.div`
  @media screen and (min-width: 480px) {
    padding: 30px;
  }
  @media screen and (min-width: 480px) {
    background-color: #000;
  }
`

injectGlobal`
  body {
    background-color: blue;
  }
`

export default () => <div><LeftArrow /><RightArrow /></div>
