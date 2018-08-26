import React, { Component } from "react";
import Link from "gatsby-link";
import ClockIcon from "react-icons/lib/fa/clock-o"

import Layout from "../layouts"
import PostIcons from "../components/PostIcons"

import { rhythm } from "../utils/typography"

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>;
  } else {
    return <span>{props.text}</span>;
  }
};

const IndexPage = ({ data, pathContext }) => {
  const { group, index, first, last, pageCount } = pathContext;
  const previousUrl = index - 1 == 1 ? "" : (index - 1).toString();
  const nextUrl = (index + 1).toString();
  console.log("HERE", group)

  return (
    <Layout>
        {group.map(({ node }) => (
          <div css={{ marginBottom: rhythm(2) }} key={node.slug}>
            <Link to={node.slug} css={{ textDecoration: `none` }}>
              <h3>{node.title}</h3>
            </Link>
            <div dangerouslySetInnerHTML={{ __html: node.content }} />
            <PostIcons node={node} />
          </div>
        ))}

        <div className="previousLink">
          <NavLink test={first} url={previousUrl} text="Go to Previous Page" />
        </div>
        <div className="nextLink">
          <NavLink test={last} url={nextUrl} text="Go to Next Page" />
        </div>
      </Layout>
  );
};
export default IndexPage;