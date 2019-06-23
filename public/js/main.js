$(document).ready(function() {
    $('.delete').on('click', function(e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/articles/delete/'+id,
            success: function(response){
                alert('Deleting Article');
                window.location.href='/';
            },
            error: function(error){
                console.log(error);
            }
        })
    })
})