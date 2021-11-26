/* eslint-disable no-console */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import './Users.css';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
  Stack,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { getProfile } from './Backend';
import { Avatar } from '@mui/material/';

const Users = function Users({ userdata }) {
  // if undefined, then ignore. If applied, then parse to int.
  const offset = useRef(1);
  const count = useRef(20);
  const formText = useRef();
  const [userListData, setUserListData] = useState([
    { isUser: false, user_id: 0, name: '', bio: '', img: '' },
  ]);
  const [displayCount, setDisplayCount] = useState(count.current);
  const [querying, setQuerying] = useState(false);

  async function getNUsers(n) {
    const promiseList = [];
    const fetchedData = [];
    const max = offset.current !== undefined ? parseInt(offset.current, 10) + n : n + 1;
    for (let i = max - n; i < max; i += 1) {
      promiseList.push(getProfile(i));
    }
    await Promise.all(promiseList).then((profiles) =>
      profiles.forEach((profile) => fetchedData.push(profile.user)),
    );
    setUserListData(fetchedData);
  }

  useEffect(() => {
    formText.current.focus();
  }, []);

  return (
    <div>
      <Row className="no-mp">
        <Col className="no-mp" md={{ span: 3 }}>
          {' '}
        </Col>
        <Col className="no-mp" id="top" md={{ span: 6 }}>
          <div
            className="d-flex flex-column justify-content-center box-shadowed p-3"
            style={{
              height: '160px',
              marginTop: '50px',
            }}
          >
            <div style={{ fontSize: '30px' }}>User Directory</div>
            <div>
              <InputGroup className="mb-2">
                <InputGroup.Text id="NameFormControl">User ID</InputGroup.Text>
                <InputGroup.Text id="NameFormControl2" className="no-mp">
                  <div className="d-flex flex-column align-content-stretch no-mp">
                    <div
                      className="search-button no-mp"
                      onClick={() => {
                        offset.current = (parseInt(offset.current) + 10).toString(10);
                        formText.current.value = offset.current;
                        formText.current.focus();
                      }}
                    >
                      ▲
                    </div>
                    <div
                      className="search-button no-mp"
                      onClick={() => {
                        offset.current = Math.max(parseInt(offset.current) - 10, 1).toString(10);
                        formText.current.value = offset.current;
                        formText.current.focus();
                      }}
                    >
                      ▼
                    </div>
                  </div>
                </InputGroup.Text>
                <FormControl
                  type="text"
                  aria-label=""
                  aria-describedby="NameFormControl"
                  maxLength={12}
                  ref={formText}
                  onChange={(text) => {
                    offset.current = text.target.value;
                  }}
                  onKeyPress={(evt) => {
                    if (evt.key === 'Enter') {
                      document.getElementById('submit').click();
                      evt.preventDefault();
                      evt.stopPropagation();
                    }
                  }}
                  onFocus={(evt) => {
                    evt.target.select();
                  }}
                  pattern="[0-9]*"
                  placeholder="1"
                />
                <DropdownButton id="dropdown-item-button" title={`Limit: ${displayCount}`}>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      count.current = 10;
                      setDisplayCount(10);
                    }}
                  >
                    10
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      count.current = 20;
                      setDisplayCount(20);
                    }}
                  >
                    20
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      count.current = 50;
                      setDisplayCount(50);
                    }}
                  >
                    50
                  </Dropdown.Item>
                </DropdownButton>
                <Button
                  variant="danger"
                  id="ButtonReset"
                  onClick={() => {
                    formText.current.value = '';
                    offset.current = '1';
                    formText.current.focus();
                    setQuerying(false);
                  }}
                >
                  X
                </Button>
                <Button
                  id="submit"
                  variant="success"
                  type="button"
                  onClick={() => {
                    setQuerying(true);
                    getNUsers(count.current);
                  }}
                >
                  Search
                </Button>
              </InputGroup>

              <Button
                variant="warning"
                type="button"
                onClick={() => {
                  offset.current = String(userdata.user_id);
                  formText.current.value = String(userdata.user_id);
                  formText.current.focus();
                }}
                style={{ marginRight: '0%' }}
              >
                Start from your ID
              </Button>
            </div>
          </div>
        </Col>
        <Col className="no-mp" md={{ span: 3 }}>
          {' '}
        </Col>
      </Row>
      <Row className="my-5 mx-0 p-0">
        <Col className="no-mp" md={{ span: 3 }}>
          {' '}
        </Col>
        <Col className="no-mp" md={{ span: 6 }}>
          <div className="box-shadowed p-3" style={{ width: '100%', minHeight: '160px' }}>
            <UserList
              userListData={userListData}
              querying={querying}
              offset={offset}
              count={count}
            />
          </div>
        </Col>
        <Col className="no-mp" md={{ span: 3 }}>
          {' '}
        </Col>
      </Row>
      {querying && (
        <Row className="no-mp">
          <Col className="no-mp" md={{ span: 12 }}>
            <div
              style={{
                aspectRatio: '900/300',
                width: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: 'url(../static/polylayers.svg)',
                marginTop: '45vh',
              }}
            ></div>
          </Col>
        </Row>
      )}
    </div>
  );
};

Users.propTypes = {
  userdata: propTypes.object,
};
const UserList = function UserList({ userListData, querying, offset, count }) {
  let message = '';
  for (let i = 0; i < userListData.length; i += 1) {
    message = `${message} - ${userListData[i].name}\n`;
  }

  return (
    <>
      {querying && (
        <>
          <div className="d-flex justify-content-between my-2 p-3">
            <>
              <div
                onClick={() => {
                  const newVal = Math.max(parseInt(offset.current, 10) - count.current, 1);
                  offset.current = newVal.toString(10);
                  document.getElementById('submit').click();
                }}
              >
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 100 }}
                  overlay={<Tooltip id="left-tooltip">Back -{count.current}</Tooltip>}
                >
                  <Button type="button" variant="secondary">
                    ←
                  </Button>
                </OverlayTrigger>
              </div>
              <div
                onClick={() => {
                  const newVal = parseInt(offset.current) + count.current;
                  offset.current = newVal.toString(10);
                  document.getElementById('submit').click();
                }}
              >
                <OverlayTrigger
                  placement="left"
                  delay={{ show: 100, hide: 100 }}
                  overlay={<Tooltip id="right-tooltip">Forward +{count.current}</Tooltip>}
                >
                  <Button type="button" variant="secondary">
                    →
                  </Button>
                </OverlayTrigger>
              </div>
            </>
          </div>
          <div className="d-flex flex-column">
            {userListData.map((user, index) =>
              user.isUser ? (
                <div
                  className="my-2 p-3 rounded light-bordered user"
                  style={{ backgroundImage: `url(../static/polygridreview${(index % 2) + 1}.svg)` }}
                >
                  <Link
                    to={`/profile/${user.user_id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Stack direction="horizontal" gap={3}>
                      <span style={{ fontSize: '20px' }}>{`${user.user_id}.`}</span>
                      <Avatar
                        src={user.img}
                        sx={{ width: 64, height: 64 }}
                        style={{ border: '2px solid lightgray' }}
                        className="shadow"
                      />
                      <span>{user.name}</span>
                      <span style={{ color: 'rgb(24,24,24,1.0)' }}>
                        {user.review_count} reviews
                      </span>
                    </Stack>
                    <div>
                      <p className="font-italic">{user.bio}</p>
                    </div>
                  </Link>
                </div>
              ) : (
                <> </>
              ),
            )}
          </div>
          <div className="d-flex align-content-end align-items-end justify-content-end">
            <div>
              <a href="#top">
                <Button type="button" variant="secondary" className="btn-lg">
                  Return to top
                </Button>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
};

UserList.propTypes = {
  userListData: propTypes.array,
  querying: propTypes.bool,
  offset: propTypes.string,
  count: propTypes.number,
};

export default Users;
