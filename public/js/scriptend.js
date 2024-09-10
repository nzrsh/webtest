function restart()
{
    let data = JSON.parse(localStorage.getItem('userData'))
    if ((data['spec'])=='student')
    {
        window.location.replace("studenttest/welcome")
    }
    else
    {
        window.location.replace("schooltest/welcome")
    }

}