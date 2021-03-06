import { Component } from "react";
import { intiStore } from "../store";

const isServer = typeof window ==="undefined"
const _NRS_ = "__NEXT_REDUX_STORE__"

function getOrCreateStore (intialState) {
  if(isServer) {
    return intiStore(intialState)
  }
  if (!window[_NRS_]) {
    window[_NRS_] = initStore(initialState)
  }
  return window[_NRS_]
}

export default (App) => {
  return class AppWidthRedux extends Component{

    static async getInitialProps (appContext) {
      const reduxStore = getOrCreateStore()
      appContext.ctx.reduxStore = reduxStore
      let appProps = {}
      if (typeof App.getInitialProps === "function"){
        appProps = await App.getInitialProps(appContext)
      }
      return{
        ...appProps,
        initialReduxState: reduxStore.getState()
      }
    }
    constructor (props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render (){
      return <App {...this.props}
      reduxStore={this.reduxStore} />
    }
  }
}