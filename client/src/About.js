import React from 'react';

const About = () => (
  <div>
    <h2>
      Where to find things that are running
    </h2>
    <ul>
      <li>
        App located at <a href="http://localhost:3000">http://localhost:3000</a>
      </li>
      <li>
        Rest server explorer located at <a href="http://localhost:3001/explorer">
          http://localhost:3001/explorer
        </a>
      </li>
      <li>
        GraphQL GraphiQL explorer located at <a href="http://localhost:3001/graphql">
          http://localhost:3001/graphql
        </a>
      </li>
    </ul>

    <p>
      Click the links at the top of the page to view a simple example of pulling
      data from the server using different methods of getting the data.
    </p>
  </div>
);

export default About;
