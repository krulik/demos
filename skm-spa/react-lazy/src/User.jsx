import { useParams } from "react-router-dom";
import { useQuery } from 'react-query';


function User() {
  const {userId} = useParams();
  const {isLoading, data} = useQuery(`user ${userId}`, async () => {
    const res = await fetch(`/users/${userId}`);
    return res.json();
  })
  return (
    <>
      <div>I'm on the {userId} user page</div>
      {isLoading ? 'loading user data...' : <p>
          {JSON.stringify(data)}
        </p>}
    </>
  )
}

export default User;
