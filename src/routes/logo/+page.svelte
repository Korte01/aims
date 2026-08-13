<script lang="ts">
    import logo from '$lib/assets/logo.png';



</script>
<div class="fixed inset-0 flex items-center justify-center bg-white">
    <img src={logo} alt="Logo" class="w-[70%] pulse-slow" />
  </div>



  <style>
    :global(.pulse-slow) {
      animation: pulse 2.5s ease-in-out infinite;
    }
  
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.95;
      }
    }
  </style>