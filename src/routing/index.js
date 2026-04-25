import React, { Fragment, useEffect, useState } from "react";

function Auth() {
  return (
    <Fragment>
    </Fragment>
  );
}

function Root(props) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 830) {
        setMobile(true);
      }
    }
  }, []);

  return (
    <>
    </>
  );
}

export { Auth, Root };
