import React, { useLayoutEffect, useState } from 'react';
import { TestMain } from './components/test/Main';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { SinglePostPage } from './features/posts/SinglePostPage';
import { PostsList } from './features/posts/PostList';
import { NavBar } from './app/Navbar';
import { EditPostForm } from './features/posts/EditPostForm';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

export class App extends React.Component {
  render(): React.ReactNode {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path='/' Component={PostsList} />
            <Route path='/tests' Component={TestMain} />
            <Route path='/posts' Component={PostsList} />
            <Route path='/posts/:postId' Component={SinglePostPage} />
            <Route path='/editPost/:postId' Component={EditPostForm} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  }
}

// 测试滚动条
export function TestScroll() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ backgroundColor: 'primary.main', p: 2 }}>
        Banner 内容
      </Box>
      <Box sx={{ flex: 1, display: 'flex', height: 0 }}>

        <Box sx={{ flex: 1, overflowY: 'auto', height: '100%', p: 2 }}>
          <Box height={400} bgcolor={'gray'} p={2} />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', height: '100%', p: 2 }}>
          <Box height={800} bgcolor={'gray'} p={2} />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box height={200} bgcolor={'gray'} p={2} />
          <Box sx={{ flex: 1, overflowY: 'auto', height: '100%', p: 2 }}>
            <Box height={800} bgcolor={'gray'} p={2} />
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box height={200} bgcolor={'gray'} p={2} />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden', p: 2 }}>
            <Box height={200} bgcolor={'gray'} p={2} />
            <Box sx={{ flex: 1, overflowY: 'auto', height: '100%', p: 2 }}>
              <Box height={400} bgcolor={'gray'} p={2} />
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}

// 测试Table滚动条: 通过ref来计算高度
export function TestTableScroll1() {
  const minWidth = 120;
  const refOut = React.useRef<HTMLDivElement>(null);
  const refHeader = React.useRef<HTMLDivElement>(null);

  const defaultCellStyle: React.CSSProperties = {
    minWidth: minWidth,
  };

  // 固定列样式
  const stickyCellLeftStyle: React.CSSProperties = {
    ...defaultCellStyle,
    position: 'sticky',
    zIndex: 100,
    background: 'white',
    left: 0, // 对于第一列
    right: 0, // 对于最后一列
    boxShadow: '5px 2px 5px grey',
    // borderRight: '2px solid black',
  };

  const stickyCellRightStyle: React.CSSProperties = {
    ...stickyCellLeftStyle,
    borderRight: undefined,
    borderLeft: '2px solid black',
  };

  const columeCount = 20;

  const [tableHeight, setTableHeight] = useState<number>(100);

  useLayoutEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      if (refOut.current && refHeader.current) {
        const boxOffsetTop = refOut.current.getBoundingClientRect().top;
        const headerHeight = refHeader.current.clientHeight;
        const newHeight = viewportHeight - boxOffsetTop - headerHeight;
        setTableHeight(newHeight);
      }
    };

    window.addEventListener('resize', updateHeight);

    // 初始更新
    updateHeight();

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <Box maxHeight={'100vh'} ref={refOut}>
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'} ref={refHeader}>
        <Typography variant='h6'>表格标题</Typography>
        <Typography variant='h6'>表格标题</Typography>
        <Typography variant='h6'>表格标题</Typography>
      </Box>
      <Box flexGrow={1}>
        <TableContainer sx={{ height: `${tableHeight}px` }}>
          <Table sx={{ minWidth: '100%' }} stickyHeader>
            <TableHead>
              <TableRow>
                {Array.from({ length: columeCount }, (_, i) => {
                  let style = i === 0 ? stickyCellLeftStyle : i === columeCount - 1 ? stickyCellRightStyle : defaultCellStyle;
                  if (i === 0 || i === columeCount - 1) {
                    style = { ...style, zIndex: 101 }
                  }
                  return <TableCell key={i} style={style}>表头{i}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 100 }, (_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: columeCount }, (_, j) => (
                    <TableCell key={j} style={j === 0 ? stickyCellLeftStyle : j === columeCount - 1 ? stickyCellRightStyle : defaultCellStyle}>单元格{i}-{j}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

// 测试Table滚动条: 通过flex和height=0来计算高度
export function TestTableScroll2() {
  const minWidth = 120;
  const defaultCellStyle: React.CSSProperties = {
    minWidth: minWidth,
  };

  // 固定列样式
  const stickyCellLeftStyle: React.CSSProperties = {
    ...defaultCellStyle,
    position: 'sticky',
    zIndex: 100,
    background: 'white',
    left: 0, // 对于第一列
    right: 0, // 对于最后一列
    boxShadow: '5px 2px 5px grey',
  };

  const stickyCellRightStyle: React.CSSProperties = {
    ...stickyCellLeftStyle,
    borderRight: undefined,
    borderLeft: '2px solid black',
  };

  const columeCount = 20;

  return (
    <Box display="flex" flexDirection="column" maxHeight="100vh">
      <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
        <Typography variant='h6'>表格标题</Typography>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', height: 0 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {Array.from({ length: columeCount }, (_, i) => {
                  let style = i === 0 ? stickyCellLeftStyle : i === columeCount - 1 ? stickyCellRightStyle : defaultCellStyle;
                  if (i === 0 || i === columeCount - 1) {
                    style = { ...style, zIndex: 101 }
                  }
                  return <TableCell key={i} style={style}>表头{i}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 100 }, (_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: columeCount }, (_, j) => (
                    <TableCell key={j} style={j === 0 ? stickyCellLeftStyle : j === columeCount - 1 ? stickyCellRightStyle : defaultCellStyle}>单元格{i}-{j}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default App;
