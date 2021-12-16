import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types'

const LoopScroll = (props: any) => {
    // const { data } = props
    const [ end, setEnd ] = useState(true)
    const [ data, setData ] = useState(props.data)
    
    const length = useMemo(()=>{
      return data.length
    }, [data])
    const checkScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
      const offNum = Math.floor(contentOffset.y / props.itemHeight + 3) % props.size
      props.onChange(offNum)
      console.log("===off set===", offNum)
        if (data.length >= length * 3)
            setData((_data: any) => _data.slice(length * 2))
        if (contentOffset.y <= props.offset) {
            setData((_data: any) => [..._data, ...data])
        }
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - props.offset && end) {
            setData((_data: any) => [..._data, ...data])
            setEnd(false)
        }
        else {
            setEnd(true)
        }

    }
    useEffect(()=>{
      setData((_data: any)=>[..._data, ..._data])
    }, [ ])

    useEffect(()=>{
      if(data){
        infListRef.current?.scrollToIndex({ index: length / 2 , animated: false })
      }
    }, [data])

    const infListRef = useRef(null)
    return (
        <FlatList
            initialScrollIndex={length/2} 
            ref={infListRef}
            data={data}
            renderItem={props.renderItem}
            onScroll={({ nativeEvent }) => checkScroll(nativeEvent)}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                infListRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
            showsVerticalScrollIndicator={props.showsVerticalScrollIndicator || false}
        />
    );
    
}

LoopScroll.propTypes = {
  onChange: PropTypes.any,
  size: PropTypes.number,
  itemHeight: PropTypes.number,
  renderItem: PropTypes.any,
  data: PropTypes.array,
  offset: PropTypes.number,
  showsVerticalScrollIndicator: PropTypes.bool
}

LoopScroll.defaultProps = {
    onChange: ()=>{},
    itemHeight: 10,
    size: 24,
    renderItem: ()=>null,
    data: [],
    offset: 0,
    showsVerticalScrollIndicator: false
};

export default LoopScroll