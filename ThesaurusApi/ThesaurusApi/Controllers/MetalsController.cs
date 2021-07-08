using Microsoft.AspNetCore.Mvc;

namespace ThesaurusApi.Controllers
{
    public class MetalsController : Controller
    {
        [HttpGet]
        [Route("test")]
        public IActionResult Test() => new OkResult();
    }
}