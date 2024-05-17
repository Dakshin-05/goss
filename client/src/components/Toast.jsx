import React from 'react'

function Toast({message, color}) {
  return (
<>
{
  color === "red" && 
<div class="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <span class="font-medium">{message}</span> 
</div>
}{
  color === "green" &&
<div class="p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  <span class="font-medium">{message}</span>
</div>
}
{
  color === "orange" &&
<div class="p-4 my-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
  <span class="font-medium">{message}</span>
</div>
}
</>
  )
}

export default Toast